import { Link } from 'react-router-dom'
import './FooterLinksSection.css'

interface FooterLinksSectionProps {
    linksTitle: string
    termsLink: string
    navHome: string
    navClassifier: string
    navMap: string
    navScanner: string
}

export default function FooterLinksSection({
    linksTitle,
    termsLink,
    navHome,
    navClassifier,
    navMap,
    navScanner
}: FooterLinksSectionProps) {
    return (
        <div className="footer-section">
            <h3 className="footer-section-title">{linksTitle}</h3>
            <ul className="footer-links">
                <li><Link to="/">{navHome}</Link></li>
                <li><Link to="/trashia">{navClassifier}</Link></li>
                <li><Link to="/map">{navMap}</Link></li>
                <li><Link to="/scanner">{navScanner}</Link></li>
                <li><Link to="/terms">{termsLink}</Link></li>
            </ul>
        </div>
    )
}
