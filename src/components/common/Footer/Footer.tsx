import { Link } from 'react-router-dom'
import './Footer.css'

interface FooterProps {
  copyrightText: string
  termsLink: string
}

export default function Footer({ copyrightText, termsLink }: FooterProps) {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Luis Carlos Picado Rojas. {copyrightText}</p>
      <Link to="/terms" className="footer-terms-link">{termsLink}</Link>
    </footer>
  )
}
