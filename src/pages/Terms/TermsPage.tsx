import './TermsPage.css'

interface TermsPageProps {
    t: {
        termsTitle: string
        termsLastUpdated: string
        termsIntro: string
        termsServiceTitle: string
        termsServiceContent: string
        termsUsageTitle: string
        termsUsageContent: string
        termsIATitle: string
        termsIAContent: string
        termsPrivacyTitle: string
        termsPrivacyContent: string
        termsThirdPartyTitle: string
        termsThirdPartyContent: string
        termsIPTitle: string
        termsIPContent: string
        termsLiabilityTitle: string
        termsLiabilityContent: string
        termsChangesTitle: string
        termsChangesContent: string
        termsContactTitle: string
        termsContactContent: string
    }
}

export default function TermsPage({ t }: TermsPageProps) {
    return (
        <main className="terms-page">
            <div className="terms-container">
                <header className="terms-header">
                    <h1>{t.termsTitle}</h1>
                    <p className="terms-updated">{t.termsLastUpdated}</p>
                </header>

                <section className="terms-intro">
                    <p>{t.termsIntro}</p>
                </section>

                <div className="terms-content">
                    <section className="terms-section">
                        <h2>1. {t.termsServiceTitle}</h2>
                        <p>{t.termsServiceContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>2. {t.termsUsageTitle}</h2>
                        <p>{t.termsUsageContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>3. {t.termsIATitle}</h2>
                        <p>{t.termsIAContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>4. {t.termsPrivacyTitle}</h2>
                        <p>{t.termsPrivacyContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>5. {t.termsThirdPartyTitle}</h2>
                        <p>{t.termsThirdPartyContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>6. {t.termsIPTitle}</h2>
                        <p>{t.termsIPContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>7. {t.termsLiabilityTitle}</h2>
                        <p>{t.termsLiabilityContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>8. {t.termsChangesTitle}</h2>
                        <p>{t.termsChangesContent}</p>
                    </section>

                    <section className="terms-section">
                        <h2>9. {t.termsContactTitle}</h2>
                        <p>{t.termsContactContent}</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
