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
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="footer-section">
            <h3 className="footer-section-title">{linksTitle}</h3>
            <ul className="footer-links">
                <li><Link to="/" onClick={scrollToTop}>{navHome}</Link></li>
                <li><Link to="/trashia" onClick={scrollToTop}>{navClassifier}</Link></li>
                <li><Link to="/map" onClick={scrollToTop}>{navMap}</Link></li>
                <li><Link to="/scanner" onClick={scrollToTop}>{navScanner}</Link></li>
                <li><Link to="/terms" onClick={scrollToTop}>{termsLink}</Link></li>
            </ul>
        </div>
    )
}
