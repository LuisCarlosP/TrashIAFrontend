/**
 * PasswordStrength - Visual indicator for password strength
 */
import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { PasswordStrengthResult, PasswordStrengthLevel } from '../../../types/auth.types';
import './PasswordStrength.css';

interface PasswordStrengthProps {
  password: string;
  language: 'es' | 'en';
}

const labels = {
  es: {
    weak: 'Débil',
    fair: 'Regular',
    good: 'Buena',
    strong: 'Fuerte',
    requirements: 'Requisitos:',
    length: 'Mínimo 8 caracteres',
    uppercase: 'Una letra mayúscula',
    lowercase: 'Una letra minúscula',
    number: 'Un número',
  },
  en: {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    requirements: 'Requirements:',
    length: 'Minimum 8 characters',
    uppercase: 'One uppercase letter',
    lowercase: 'One lowercase letter',
    number: 'One number',
  },
};

function calculateStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level: PasswordStrengthLevel = 'weak';
  if (score >= 5) level = 'strong';
  else if (score >= 4) level = 'good';
  else if (score >= 3) level = 'fair';

  return { score, level, checks };
}

export default function PasswordStrength({ password, language }: PasswordStrengthProps) {
  const t = labels[language];

  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-bar-container">
        <div
          className={`strength-bar strength-${strength.level}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      <span className={`strength-label strength-${strength.level}`}>
        {t[strength.level]}
      </span>

      <div className="password-requirements">
        <span className="requirements-title">{t.requirements}</span>
        <ul className="requirements-list">
          <li className={strength.checks.length ? 'met' : ''}>
            <FontAwesomeIcon 
              icon={strength.checks.length ? faCheck : faTimes} 
              className="requirement-icon"
            />
            {t.length}
          </li>
          <li className={strength.checks.uppercase ? 'met' : ''}>
            <FontAwesomeIcon 
              icon={strength.checks.uppercase ? faCheck : faTimes} 
              className="requirement-icon"
            />
            {t.uppercase}
          </li>
          <li className={strength.checks.lowercase ? 'met' : ''}>
            <FontAwesomeIcon 
              icon={strength.checks.lowercase ? faCheck : faTimes} 
              className="requirement-icon"
            />
            {t.lowercase}
          </li>
          <li className={strength.checks.number ? 'met' : ''}>
            <FontAwesomeIcon 
              icon={strength.checks.number ? faCheck : faTimes} 
              className="requirement-icon"
            />
            {t.number}
          </li>
        </ul>
      </div>
    </div>
  );
}
