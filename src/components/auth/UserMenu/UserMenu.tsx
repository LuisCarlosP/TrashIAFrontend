/**
 * UserMenu - User dropdown menu for header
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSignOutAlt,
  faChevronDown,
  faSignInAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import './UserMenu.css';

interface UserMenuProps {
  language: 'es' | 'en';
}

const translations = {
  es: {
    profile: 'Mi Perfil',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
  },
  en: {
    profile: 'My Profile',
    logout: 'Sign Out',
    login: 'Sign In',
    register: 'Sign Up',
  },
};

export default function UserMenu({ language }: UserMenuProps) {
  const t = translations[language];
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  // Guest view - show login/register buttons
  if (!isAuthenticated) {
    return (
      <div className="user-menu-guest">
        <Link to="/auth/login" className="auth-btn login-btn">
          <FontAwesomeIcon icon={faSignInAlt} />
          <span>{t.login}</span>
        </Link>
        <Link to="/auth/register" className="auth-btn register-btn">
          <FontAwesomeIcon icon={faUserPlus} />
          <span>{t.register}</span>
        </Link>
      </div>
    );
  }

  // Authenticated user view
  const displayName = user?.profile?.name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.profile?.profile_picture;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">{initials}</div>
        )}
        <span className="user-name">{displayName}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown" role="menu">
          <Link
            to="/profile"
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <FontAwesomeIcon icon={faUser} />
            <span>{t.profile}</span>
          </Link>
          <hr className="dropdown-divider" />
          <button
            className="dropdown-item logout"
            onClick={handleLogout}
            role="menuitem"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>{t.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}
