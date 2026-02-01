/**
 * ForgotPasswordPage - Request password reset
 */
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faSpinner,
  faCheckCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AuthHeader, AuthInput } from '../../../components/auth';
import { useAuth } from '../../../context/AuthContext';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import './ForgotPasswordPage.css';

interface ForgotPasswordPageProps {
  language: 'es' | 'en';
}

const translations = {
  es: {
    title: 'Recuperar Contraseña',
    subtitle: 'Te enviaremos un enlace para restablecer tu contraseña',
    email: 'Correo electrónico',
    emailPlaceholder: 'tu@email.com',
    sendButton: 'Enviar Enlace',
    sending: 'Enviando...',
    successTitle: '¡Correo Enviado!',
    successMessage:
      'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.',
    backToLogin: 'Volver al Login',
    rememberPassword: '¿Recordaste tu contraseña?',
    login: 'Iniciar Sesión',
  },
  en: {
    title: 'Forgot Password',
    subtitle: "We'll send you a link to reset your password",
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    sendButton: 'Send Link',
    sending: 'Sending...',
    successTitle: 'Email Sent!',
    successMessage:
      'If the email exists in our system, you will receive a link to reset your password.',
    backToLogin: 'Back to Login',
    rememberPassword: 'Remember your password?',
    login: 'Sign In',
  },
};

export default function ForgotPasswordPage({ language }: ForgotPasswordPageProps) {
  const t = translations[language];
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending email');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="auth-page forgot-password-page">
        <PageBackground />
        <div className="auth-container">
          <AuthHeader />
          <div className="forgot-success">
            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
            <h2 className="success-title">{t.successTitle}</h2>
            <p className="success-message">{t.successMessage}</p>
            <Link to="/auth/login" className="btn btn-primary back-button">
              <FontAwesomeIcon icon={faArrowLeft} />
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page forgot-password-page">
      <PageBackground />
      <div className="auth-container">
        <AuthHeader />
        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form-header">
            <h2 className="forgot-title">{t.title}</h2>
            <p className="forgot-subtitle">{t.subtitle}</p>
          </div>

          {error && (
            <div className="auth-error-message" role="alert">
              {error}
            </div>
          )}

          <div className="forgot-form-fields">
            <AuthInput
              label={t.email}
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={faEnvelope}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary forgot-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                {t.sending}
              </>
            ) : (
              t.sendButton
            )}
          </button>

          <p className="forgot-footer">
            {t.rememberPassword}{' '}
            <Link to="/auth/login" className="auth-link">
              {t.login}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
