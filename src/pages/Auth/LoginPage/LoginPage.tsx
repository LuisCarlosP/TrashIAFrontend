/**
 * LoginPage - Login page component
 */
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthHeader, LoginForm } from '../../../components/auth';
import { useAuth } from '../../../context/AuthContext';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import { Loading } from '../../../components/common/LoadingError/LoadingError';
import './LoginPage.css';

interface LoginPageProps {
  language: 'es' | 'en';
}

export default function LoginPage({ language }: LoginPageProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from state or default to home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="auth-page">
        <Loading message={language === 'es' ? 'Cargando...' : 'Loading...'} />
      </div>
    );
  }

  return (
    <div className="auth-page login-page">
      <PageBackground />
      <div className="auth-container">
        <AuthHeader />
        <LoginForm language={language} onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
