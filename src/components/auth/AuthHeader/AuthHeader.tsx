/**
 * AuthHeader - Header for authentication pages
 */
import { Link } from 'react-router-dom';
import trashiaIconWhite from '../../../assets/trashia-icon-white.svg';
import './AuthHeader.css';

export default function AuthHeader() {
  return (
    <div className="auth-header">
      <Link to="/" className="auth-header-logo">
        <img src={trashiaIconWhite} alt="TrashIA" className="auth-logo-icon" />
        <span className="auth-logo-text">TrashIA</span>
      </Link>
    </div>
  );
}
