/**
 * RegisterPage - Registration page component
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHeader, RegisterForm } from '../../../components/auth';
import { useAuth } from '../../../context/AuthContext';
import PageBackground from '../../../components/common/PageBackground/PageBackground';
import { Loading } from '../../../components/common/LoadingError/LoadingError';
import './RegisterPage.css';

interface RegisterPageProps {
  language: 'es' | 'en';
}

export default function RegisterPage({ language }: RegisterPageProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="auth-page">
        <Loading message={language === 'es' ? 'Cargando...' : 'Loading...'} />
      </div>
    );
  }

  return (
    <div className="auth-page register-page">
      <PageBackground />
      <div className="auth-container auth-container-wide">
        <AuthHeader />
        <RegisterForm language={language} />
      </div>
    </div>
  );
}
