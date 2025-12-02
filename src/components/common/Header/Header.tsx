import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faRecycle, 
  faLanguage, 
  faBars, 
  faTimes,
  faCamera,
  faMapLocationDot,
  faHome
} from '@fortawesome/free-solid-svg-icons'
import type { Language } from '../../../translations'

interface HeaderProps {
  language: Language
  onToggleLanguage: () => void
  t: {
    appTitle: string
    navHome: string
    navClassifier: string
    navMap: string
    menuToggle: string
  }
}

export default function Header({ language, onToggleLanguage, t }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <FontAwesomeIcon icon={faRecycle} className="logo-icon" />
          <span className="logo-text">{t.appTitle}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faHome} />
            <span>{t.navHome}</span>
          </Link>
          <Link 
            to="/trashia" 
            className={`nav-link ${isActive('/trashia') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faCamera} />
            <span>{t.navClassifier}</span>
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${isActive('/map') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span>{t.navMap}</span>
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="header-actions">
          <button className="language-toggle" onClick={onToggleLanguage}>
            <FontAwesomeIcon icon={faLanguage} />
            <span>{language === 'es' ? 'EN' : 'ES'}</span>
          </button>

          {/* Mobile menu button */}
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
            aria-label={t.menuToggle}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <Link 
          to="/" 
          className={`nav-mobile-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>{t.navHome}</span>
        </Link>
        <Link 
          to="/trashia" 
          className={`nav-mobile-link ${isActive('/trashia') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <FontAwesomeIcon icon={faCamera} />
          <span>{t.navClassifier}</span>
        </Link>
        <Link 
          to="/map" 
          className={`nav-mobile-link ${isActive('/map') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <FontAwesomeIcon icon={faMapLocationDot} />
          <span>{t.navMap}</span>
        </Link>
      </nav>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </header>
  )
}
