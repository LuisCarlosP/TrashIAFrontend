import './FooterContactSection.css'

interface FooterContactSectionProps {
    contactTitle: string
    emailLabel: string
    phoneLabel: string
}

export default function FooterContactSection({
    contactTitle,
    emailLabel,
    phoneLabel
}: FooterContactSectionProps) {
    return (
        <div className="footer-section">
            <h3 className="footer-section-title">{contactTitle}</h3>
            <div className="footer-contact">
                <p className="footer-contact-item">
                    <span className="footer-contact-label">{emailLabel}:</span>
                    <a href="mailto:picadoluiscarlos@gmail.com">picadoluiscarlos@gmail.com</a>
                </p>
                <p className="footer-contact-item">
                    <span className="footer-contact-label">{phoneLabel}:</span>
                    <a href="tel:+50687233132">+506 8723 3132</a>
                </p>
            </div>
        </div>
    )
}
