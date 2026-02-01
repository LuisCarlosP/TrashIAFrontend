/**
 * AuthInput - Reusable input component for authentication forms
 */
import { useState, type InputHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './AuthInput.css';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  icon?: IconDefinition;
  showPasswordToggle?: boolean;
}

export default function AuthInput({
  label,
  error,
  icon,
  showPasswordToggle,
  type = 'text',
  id,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`auth-input-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={inputId} className="auth-input-label">
        {label}
      </label>
      <div className="auth-input-wrapper">
        {icon && <FontAwesomeIcon icon={icon} className="auth-input-icon" />}
        <input
          id={inputId}
          className={`auth-input ${icon ? 'has-icon' : ''} ${showPasswordToggle ? 'has-toggle' : ''}`}
          type={inputType}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {error && <span className="auth-input-error">{error}</span>}
    </div>
  );
}
