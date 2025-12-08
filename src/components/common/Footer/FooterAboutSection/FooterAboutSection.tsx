import './FooterAboutSection.css'

interface FooterAboutSectionProps {
    aboutTitle: string
    aboutText: string
    goalsTitle: string
    goal1: string
    goal2: string
    goal3: string
    goal4: string
}

export default function FooterAboutSection({
    aboutTitle,
    aboutText,
    goalsTitle,
    goal1,
    goal2,
    goal3,
    goal4
}: FooterAboutSectionProps) {
    return (
        <div className="footer-section">
            <h3 className="footer-section-title">{aboutTitle}</h3>
            <p className="footer-about-text">{aboutText}</p>

            <h4 className="footer-subsection-title">{goalsTitle}</h4>
            <ul className="footer-goals-list">
                <li>{goal1}</li>
                <li>{goal2}</li>
                <li>{goal3}</li>
                <li>{goal4}</li>
            </ul>
        </div>
    )
}
