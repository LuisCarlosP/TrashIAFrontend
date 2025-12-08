import { useState, useEffect, lazy, Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { translations, type Language } from './translations'
import { Header, Footer, Loading } from './components'

const HomePage = lazy(() => import('./pages/HomePage/HomePage'))
const ClassifierPage = lazy(() => import('./pages/Classifier/ClassifierPage'))
const RecyclingMap = lazy(() => import('./pages/Map/RecyclingMap'))
const StatsPage = lazy(() => import('./pages/Stats/StatsPage'))
const ScannerPage = lazy(() => import('./pages/Scanner/ScannerPage'))
const TermsPage = lazy(() => import('./pages/Terms/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'))

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved === 'es' || saved === 'en') ? saved : 'es'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])
  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <Router>
      <div className="app">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
          t={{
            appTitle: t.appTitle,
            navHome: t.navHome,
            navClassifier: t.navClassifier,
            navMap: t.navMap,
            navStats: t.navStats,
            navScanner: t.navScanner,
            menuToggle: t.menuToggle
          }}
        />


        <main className="main-content">
          <Suspense fallback={<Loading message="Cargando..." />}>
            <Routes>
              <Route path="/" element={<HomePage t={t} />} />
              <Route path="/trashia" element={<ClassifierPage language={language} t={t} />} />
              <Route path="/map" element={<RecyclingMap t={t} />} />
              <Route path="/stats" element={<StatsPage language={language} t={t} />} />
              <Route path="/scanner" element={<ScannerPage t={t} lang={language} />} />
              <Route path="/terms" element={<TermsPage t={t} />} />
              <Route path="*" element={<NotFoundPage t={t} />} />
            </Routes>
          </Suspense>
        </main>


        <Footer
          language={language}
          copyrightText={t.footerCopyright}
          termsLink={t.termsLink}
          donateText={t.footerDonateText}
          donateButtonText={t.footerDonateButton}
          aboutTitle={t.footerAboutTitle}
          aboutText={t.footerAboutText}
          goalsTitle={t.footerGoalsTitle}
          goal1={t.footerGoal1}
          goal2={t.footerGoal2}
          goal3={t.footerGoal3}
          goal4={t.footerGoal4}
          linksTitle={t.footerLinksTitle}
          contactTitle={t.footerContactTitle}
          emailLabel={t.footerEmail}
          phoneLabel={t.footerPhone}
          navHome={t.navHome}
          navClassifier={t.navClassifier}
          navMap={t.navMap}
          navScanner={t.navScanner}
        />
      </div>
    </Router>
  )
}

export default App
