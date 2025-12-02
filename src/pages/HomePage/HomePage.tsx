import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faMapLocationDot, 
  faLeaf,
  faRecycle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

interface HomePageProps {
  t: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    startClassifying: string;
    findRecyclingPoints: string;
    featureClassifierTitle: string;
    featureClassifierDesc: string;
    featureMapTitle: string;
    featureMapDesc: string;
    featureChatTitle: string;
    featureChatDesc: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
  };
}

export default function HomePage({ t }: HomePageProps) {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <FontAwesomeIcon icon={faLeaf} />
          </div>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <p className="hero-description">{t.heroDescription}</p>
          
          <div className="hero-buttons">
            <Link to="/trashia" className="btn btn-primary">
              <FontAwesomeIcon icon={faCamera} />
              {t.startClassifying}
            </Link>
            <Link to="/map" className="btn btn-secondary">
              <FontAwesomeIcon icon={faMapLocationDot} />
              {t.findRecyclingPoints}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon classifier">
              <FontAwesomeIcon icon={faCamera} />
            </div>
            <h3>{t.featureClassifierTitle}</h3>
            <p>{t.featureClassifierDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon map">
              <FontAwesomeIcon icon={faMapLocationDot} />
            </div>
            <h3>{t.featureMapTitle}</h3>
            <p>{t.featureMapDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon chat">
              <FontAwesomeIcon icon={faRecycle} />
            </div>
            <h3>{t.featureChatTitle}</h3>
            <p>{t.featureChatDesc}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>{t.howItWorksTitle}</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>{t.step1Title}</h3>
            <p>{t.step1Desc}</p>
          </div>
          <div className="step-arrow">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>{t.step2Title}</h3>
            <p>{t.step2Desc}</p>
          </div>
          <div className="step-arrow">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>{t.step3Title}</h3>
            <p>{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaSubtitle}</p>
        <Link to="/trashia" className="btn btn-cta">
          <FontAwesomeIcon icon={faCamera} />
          {t.ctaButton}
        </Link>
      </section>
    </div>
  );
}
