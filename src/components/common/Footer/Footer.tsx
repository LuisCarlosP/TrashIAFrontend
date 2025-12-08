import './Footer.css'
import FooterAboutSection from './FooterAboutSection/FooterAboutSection'
import FooterLinksSection from './FooterLinksSection/FooterLinksSection'
import FooterContactSection from './FooterContactSection/FooterContactSection'
import PayPalDonateButton from './PayPalDonateButton/PayPalDonateButton'

interface FooterProps {
  language: 'es' | 'en'
  copyrightText: string
  termsLink: string
  donateText: string
  donateButtonText: string
  aboutTitle: string
  aboutText: string
  goalsTitle: string
  goal1: string
  goal2: string
  goal3: string
  goal4: string
  linksTitle: string
  contactTitle: string
  emailLabel: string
  phoneLabel: string
  navHome: string
  navClassifier: string
  navMap: string
  navScanner: string
}

export default function Footer({
  copyrightText,
  termsLink,
  donateText,
  aboutTitle,
  aboutText,
  goalsTitle,
  goal1,
  goal2,
  goal3,
  goal4,
  linksTitle,
  contactTitle,
  emailLabel,
  phoneLabel,
  navHome,
  navClassifier,
  navMap,
  navScanner
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <FooterAboutSection
          aboutTitle={aboutTitle}
          aboutText={aboutText}
          goalsTitle={goalsTitle}
          goal1={goal1}
          goal2={goal2}
          goal3={goal3}
          goal4={goal4}
        />

        {/* Quick Links Section */}
        <FooterLinksSection
          linksTitle={linksTitle}
          termsLink={termsLink}
          navHome={navHome}
          navClassifier={navClassifier}
          navMap={navMap}
          navScanner={navScanner}
        />

        {/* Contact Section with Donate Button */}
        <div className="footer-section">
          <FooterContactSection
            contactTitle={contactTitle}
            emailLabel={emailLabel}
            phoneLabel={phoneLabel}
          />
          <PayPalDonateButton donateText={donateText} />
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Luis Carlos Picado Rojas. {copyrightText}</p>
      </div>
    </footer>
  )
}
