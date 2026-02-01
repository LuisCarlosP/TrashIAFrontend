/**
 * ProfilePage - User profile management page
 * Allows users to update their name, phone, and profile picture
 * Includes a separate tab for changing password
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPhone,
  faCamera,
  faSave,
  faArrowLeft,
  faKey,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import { AuthInput } from '../../../components/auth';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import { Loading } from '../../../components/common/LoadingError/LoadingError';
import { authService } from '../../../services/auth';
import './ProfilePage.css';

interface ProfilePageProps {
  language: 'es' | 'en';
}

type TabType = 'profile' | 'password';

const translations = {
  es: {
    title: 'Mi Perfil',
    subtitle: 'Gestiona tu información personal',
    nameLabel: 'Nombre',
    lastNameLabel: 'Apellido',
    phoneLabel: 'Teléfono',
    emailLabel: 'Correo electrónico',
    emailNote: 'El correo no se puede cambiar',
    changePhoto: 'Cambiar foto',
    removePhoto: 'Eliminar foto',
    saveChanges: 'Guardar cambios',
    saving: 'Guardando...',
    changePassword: 'Cambiar contraseña',
    changePasswordNote: 'Se abrirá en una nueva pestaña',
    back: 'Volver',
    successMessage: 'Perfil actualizado correctamente',
    errorMessage: 'Error al actualizar el perfil',
    uploadError: 'Error al subir la imagen',
    loadingProfile: 'Cargando perfil...',
    namePlaceholder: 'Tu nombre',
    lastNamePlaceholder: 'Tu apellido',
    phonePlaceholder: '+56 9 1234 5678',
    nameRequired: 'El nombre es obligatorio',
    lastNameRequired: 'El apellido es obligatorio',
    phoneInvalid: 'Formato de teléfono inválido',
    maxFileSize: 'El archivo debe ser menor a 5MB',
    invalidFileType: 'Solo se permiten imágenes (JPG, PNG, GIF, WebP)',
    // Password tab translations
    tabProfile: 'Perfil',
    tabPassword: 'Contraseña',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    currentPasswordPlaceholder: 'Ingresa tu contraseña actual',
    newPasswordPlaceholder: 'Ingresa tu nueva contraseña',
    confirmPasswordPlaceholder: 'Confirma tu nueva contraseña',
    passwordChanged: 'Contraseña cambiada correctamente',
    passwordError: 'Error al cambiar la contraseña',
    currentPasswordRequired: 'La contraseña actual es obligatoria',
    newPasswordRequired: 'La nueva contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordUppercase: 'Debe contener al menos una mayúscula',
    passwordLowercase: 'Debe contener al menos una minúscula',
    passwordNumber: 'Debe contener al menos un número',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    incorrectPassword: 'La contraseña actual es incorrecta',
    changingPassword: 'Cambiando...',
  },
  en: {
    title: 'My Profile',
    subtitle: 'Manage your personal information',
    nameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    emailNote: 'Email cannot be changed',
    changePhoto: 'Change photo',
    removePhoto: 'Remove photo',
    saveChanges: 'Save changes',
    saving: 'Saving...',
    changePassword: 'Change password',
    changePasswordNote: 'Opens in a new tab',
    back: 'Back',
    successMessage: 'Profile updated successfully',
    errorMessage: 'Error updating profile',
    uploadError: 'Error uploading image',
    loadingProfile: 'Loading profile...',
    namePlaceholder: 'Your first name',
    lastNamePlaceholder: 'Your last name',
    phonePlaceholder: '+1 234 567 8900',
    nameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    phoneInvalid: 'Invalid phone format',
    maxFileSize: 'File must be less than 5MB',
    invalidFileType: 'Only images are allowed (JPG, PNG, GIF, WebP)',
    // Password tab translations
    tabProfile: 'Profile',
    tabPassword: 'Password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    currentPasswordPlaceholder: 'Enter your current password',
    newPasswordPlaceholder: 'Enter your new password',
    confirmPasswordPlaceholder: 'Confirm your new password',
    passwordChanged: 'Password changed successfully',
    passwordError: 'Error changing password',
    currentPasswordRequired: 'Current password is required',
    newPasswordRequired: 'New password is required',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordUppercase: 'Must contain at least one uppercase letter',
    passwordLowercase: 'Must contain at least one lowercase letter',
    passwordNumber: 'Must contain at least one number',
    passwordsDoNotMatch: 'Passwords do not match',
    incorrectPassword: 'Current password is incorrect',
    changingPassword: 'Changing...',
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function ProfilePage({ language }: ProfilePageProps) {
  const t = translations[language];
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Profile Form state
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    lastName?: string;
    phone?: string;
  }>({});

  // Password validation errors
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Initialize form with user data
  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || '');
      setLastName(user.profile.last_name || '');
      setPhone(user.profile.telephone || '');
      setProfilePicture(user.profile.profile_picture || null);
      setPreviewUrl(user.profile.profile_picture || null);
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t.lastNameRequired;
    }

    if (phone.trim()) {
      // Basic phone validation - allows optional + and 8-15 digits
      const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?\d{8,15}$/.test(cleanedPhone)) {
        newErrors.phone = t.phoneInvalid;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage(t.invalidFileType);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t.maxFileSize);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const uploadedUrl = await authService.uploadProfilePicture(file);
      setProfilePicture(uploadedUrl);
      setPreviewUrl(uploadedUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(t.uploadError);
      // Revert preview
      setPreviewUrl(profilePicture);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        name: name.trim(),
        last_name: lastName.trim(),
        telephone: phone.trim() || undefined,
        // Send empty string to remove photo, or the URL to keep/update it
        profile_picture: profilePicture === null ? '' : profilePicture,
      });
      setSuccessMessage(t.successMessage);
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage(t.errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: typeof passwordErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = t.currentPasswordRequired;
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = t.newPasswordRequired;
    } else {
      if (newPassword.length < 8) {
        newErrors.newPassword = t.passwordMinLength;
      } else if (!/[A-Z]/.test(newPassword)) {
        newErrors.newPassword = t.passwordUppercase;
      } else if (!/[a-z]/.test(newPassword)) {
        newErrors.newPassword = t.passwordLowercase;
      } else if (!/\d/.test(newPassword)) {
        newErrors.newPassword = t.passwordNumber;
      }
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t.passwordsDoNotMatch;
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccessMessage(t.passwordChanged);
      // Clear form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
    } catch (error) {
      console.error('Change password error:', error);
      const errorMsg = error instanceof Error ? error.message : '';
      if (errorMsg.toLowerCase().includes('incorrect') || errorMsg.toLowerCase().includes('invalid')) {
        setErrorMessage(t.incorrectPassword);
      } else {
        setErrorMessage(t.passwordError);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-page">
        <Loading message={t.loadingProfile} />
      </div>
    );
  }

  const displayInitials = name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="auth-page profile-page">
      <PageBackground />
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label={t.back}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="profile-header-text">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="profile-message success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="profile-message error">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>{t.tabProfile}</span>
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FontAwesomeIcon icon={faLock} />
            <span>{t.tabPassword}</span>
          </button>
        </div>

        {/* Profile Form */}
        {activeTab === 'profile' && (
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              {isUploading ? (
                <div className="profile-picture-loading">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  {displayInitials}
                </div>
              )}
              <button
                type="button"
                className="change-photo-button"
                onClick={handlePhotoClick}
                disabled={isUploading}
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="photo-actions">
              <button
                type="button"
                className="photo-action-btn"
                onClick={handlePhotoClick}
                disabled={isUploading}
              >
                {t.changePhoto}
              </button>
              {previewUrl && (
                <button
                  type="button"
                  className="photo-action-btn remove"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                >
                  {t.removePhoto}
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="profile-fields">
            {/* Email (read-only) */}
            <div className="profile-email-section">
              <label className="profile-label">{t.emailLabel}</label>
              <div className="profile-email-value">{user?.email}</div>
              <span className="profile-email-note">{t.emailNote}</span>
            </div>

            {/* Name */}
            <AuthInput
              label={t.nameLabel}
              icon={faUser}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              error={errors.name}
              disabled={isSaving}
            />

            {/* Last Name */}
            <AuthInput
              label={t.lastNameLabel}
              icon={faUser}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t.lastNamePlaceholder}
              error={errors.lastName}
              disabled={isSaving}
            />

            {/* Phone */}
            <AuthInput
              label={t.phoneLabel}
              icon={faPhone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              error={errors.phone}
              disabled={isSaving}
              type="tel"
            />
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isSaving || isUploading}
            >
              {isSaving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>{t.saving}</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  <span>{t.saveChanges}</span>
                </>
              )}
            </button>
          </div>
        </form>
        )}

        {/* Password Form */}
        {activeTab === 'password' && (
          <form className="profile-form password-form" onSubmit={handlePasswordSubmit}>
            <div className="password-form-fields">
              {/* Current Password */}
              <div className="password-input-wrapper">
                <AuthInput
                  label={t.currentPassword}
                  icon={faLock}
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t.currentPasswordPlaceholder}
                  error={passwordErrors.currentPassword}
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {/* New Password */}
              <div className="password-input-wrapper">
                <AuthInput
                  label={t.newPassword}
                  icon={faKey}
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.newPasswordPlaceholder}
                  error={passwordErrors.newPassword}
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {/* Confirm Password */}
              <div className="password-input-wrapper">
                <AuthInput
                  label={t.confirmPassword}
                  icon={faKey}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  error={passwordErrors.confirmPassword}
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="profile-actions">
              <button
                type="submit"
                className="save-button"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>{t.changingPassword}</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faKey} />
                    <span>{t.changePassword}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
