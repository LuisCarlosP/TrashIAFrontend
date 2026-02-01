/**
 * ResetPasswordPage - Reset password with token
 */
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faSpinner,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthHeader, AuthInput, PasswordStrength } from '../../../components/auth';
import { useAuth } from '../../../context/AuthContext';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import '../LoginPage/LoginPage.css'; // Import base auth styles
import './ResetPasswordPage.css';

interface ResetPasswordPageProps {
  language: 'es' | 'en';
}

const translations = {
  es: {
    title: 'Nueva Contraseña',
    subtitle: 'Ingresa tu nueva contraseña',
    password: 'Nueva Contraseña',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    confirmPassword: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Repite tu contraseña',
    resetButton: 'Cambiar Contraseña',
    resetting: 'Cambiando...',
    successTitle: '¡Contraseña Actualizada!',
    successMessage: 'Tu contraseña ha sido cambiada exitosamente.',
    loginButton: 'Iniciar Sesión',
    passwordMismatch: 'Las contraseñas no coinciden',
    invalidToken: 'El enlace ha expirado o es inválido',
    requestNewLink: 'Solicitar nuevo enlace',
  },
  en: {
    title: 'New Password',
    subtitle: 'Enter your new password',
    password: 'New Password',
    passwordPlaceholder: 'Minimum 8 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Repeat your password',
    resetButton: 'Change Password',
    resetting: 'Changing...',
    successTitle: 'Password Updated!',
    successMessage: 'Your password has been changed successfully.',
    loginButton: 'Sign In',
    passwordMismatch: 'Passwords do not match',
    invalidToken: 'The link has expired or is invalid',
    requestNewLink: 'Request new link',
  },
};

/**
 * Parse hash fragment parameters from URL
 * Supabase returns tokens in hash: #access_token=...&type=recovery
 */
function parseHashParams(hash: string): URLSearchParams {
  const hashString = hash.startsWith('#') ? hash.substring(1) : hash;
  return new URLSearchParams(hashString);
}

export default function ResetPasswordPage({ language }: ResetPasswordPageProps) {
  const t = translations[language];
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Extract token from hash or query params
  useEffect(() => {
    const hashParams = parseHashParams(location.hash);
    const searchParams = new URLSearchParams(location.search);
    
    // Try hash first (Supabase default), then query params
    const token = hashParams.get('access_token') || 
                  searchParams.get('access_token') || 
                  searchParams.get('token');
    
    // Get refresh_token from hash (Supabase sends both tokens)
    const refresh = hashParams.get('refresh_token') || 
                    searchParams.get('refresh_token');
    
    console.log('Reset password - token found:', !!token);
    setAccessToken(token);
    setRefreshToken(refresh);
    setIsCheckingToken(false);
  }, [location.hash, location.search]);

  // Loading state while checking for token
  if (isCheckingToken) {
    return (
      <div className="auth-page reset-password-page">
        <PageBackground />
        <div className="auth-container">
          <AuthHeader />
          <div className="reset-loading">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!accessToken) {
    return (
      <div className="auth-page reset-password-page">
        <PageBackground />
        <div className="auth-container">
          <AuthHeader />
          <div className="reset-error">
            <p className="error-message">{t.invalidToken}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth/forgot-password')}
            >
              {t.requestNewLink}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(accessToken, password, refreshToken);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.invalidToken);
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="auth-page reset-password-page">
        <PageBackground />
        <div className="auth-container">
          <AuthHeader />
          <div className="reset-success">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <h2 className="success-title">{t.successTitle}</h2>
            <p className="success-message">{t.successMessage}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth/login')}
            >
              {t.loginButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page reset-password-page">
      <PageBackground />
      <div className="auth-container">
        <AuthHeader />
        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="reset-form-header">
            <h2 className="reset-title">{t.title}</h2>
            <p className="reset-subtitle">{t.subtitle}</p>
          </div>

          {error && (
            <div className="auth-error-message" role="alert">
              {error}
            </div>
          )}

          <div className="reset-form-fields">
            <AuthInput
              label={t.password}
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={faLock}
              showPasswordToggle
              required
              disabled={isLoading}
            />

            <PasswordStrength password={password} language={language} />

            <AuthInput
              label={t.confirmPassword}
              type="password"
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={faLock}
              showPasswordToggle
              required
              disabled={isLoading}
              error={
                confirmPassword && password !== confirmPassword
                  ? t.passwordMismatch
                  : null
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary reset-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                {t.resetting}
              </>
            ) : (
              t.resetButton
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
