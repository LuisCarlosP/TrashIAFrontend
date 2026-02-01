/**
 * AuthCallbackPage - Handles Supabase auth redirects
 */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import './AuthCallbackPage.css';

type CallbackStatus = 'loading' | 'success' | 'error';

const messages = {
  es: {
    loading: 'Procesando...',
    emailVerified: '¡Email verificado correctamente!',
    redirecting: 'Redirigiendo...',
    error: 'Ha ocurrido un error',
  },
  en: {
    loading: 'Processing...',
    emailVerified: 'Email verified successfully!',
    redirecting: 'Redirecting...',
    error: 'An error occurred',
  },
};

/**
 * Parse hash fragment parameters from URL
 * Supabase returns tokens in hash: #access_token=...&type=signup
 */
function parseHashParams(hash: string): URLSearchParams {
  // Remove the leading # if present
  const hashString = hash.startsWith('#') ? hash.substring(1) : hash;
  return new URLSearchParams(hashString);
}

interface AuthCallbackPageProps {
  language?: 'es' | 'en';
}

export default function AuthCallbackPage({ language = 'es' }: AuthCallbackPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState(messages[language].loading);

  const t = messages[language];

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase returns params in hash fragment, not query string
      const hashParams = parseHashParams(location.hash);
      const searchParams = new URLSearchParams(location.search);
      
      // Try hash first (Supabase default), then query params
      const type = hashParams.get('type') || searchParams.get('type');
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
      const error = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      console.log('Auth callback params:', { type, hasAccessToken: !!accessToken, error });

      // Handle errors
      if (error) {
        setStatus('error');
        setMessage(errorDescription || t.error);
        setTimeout(() => navigate('/auth/login'), 3000);
        return;
      }

      // Email confirmation / signup verification
      if (type === 'signup' || type === 'email_confirmation' || type === 'email') {
        setStatus('success');
        setMessage(t.emailVerified);
        
        // If we have tokens, user is already logged in after verification
        if (accessToken && refreshToken) {
          // Store tokens or let AuthContext handle it
          setTimeout(() => navigate('/'), 2000);
        } else {
          setTimeout(() => navigate('/auth/login'), 2000);
        }
        return;
      }

      // Password recovery - redirect to reset password page
      if (type === 'recovery' && accessToken) {
        navigate(`/auth/reset-password?access_token=${accessToken}&refresh_token=${refreshToken || ''}`);
        return;
      }

      // If we have access token but no specific type, it's a successful auth
      if (accessToken) {
        setStatus('success');
        setMessage(t.emailVerified);
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Default: redirect to login
      setMessage(t.redirecting);
      setTimeout(() => navigate('/auth/login'), 1000);
    };

    handleCallback();
  }, [location.hash, location.search, navigate, t]);

  return (
    <div className="auth-page auth-callback-page">
      <PageBackground />
      <div className="callback-content">
        {status === 'loading' && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="callback-icon loading"
          />
        )}
        {status === 'success' && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="callback-icon success"
          />
        )}
        {status === 'error' && (
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="callback-icon error"
          />
        )}
        <p className="callback-message">{message}</p>
      </div>
    </div>
  );
}
