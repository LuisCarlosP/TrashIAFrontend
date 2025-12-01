import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecycle, faLanguage } from '@fortawesome/free-solid-svg-icons'
import type { Language } from '../translations'

interface HeaderProps {
  title: string
  subtitle: string
  language: Language
  onToggleLanguage: () => void
}

export default function Header({ title, subtitle, language, onToggleLanguage }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">
          <FontAwesomeIcon icon={faRecycle} className="header-icon" />
          {title}
        </h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <button className="language-toggle" onClick={onToggleLanguage}>
        <FontAwesomeIcon icon={faLanguage} />
        <span>{language === 'es' ? 'EN' : 'ES'}</span>
      </button>
    </header>
  )
}
