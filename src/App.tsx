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

        <Suspense fallback={<Loading message="Cargando..." />}>
          <Routes>
            <Route path="/" element={<HomePage t={t} />} />
            <Route path="/trashia" element={<ClassifierPage language={language} t={t} />} />
            <Route path="/map" element={<RecyclingMap t={t} />} />
            <Route path="/stats" element={<StatsPage language={language} t={t} />} />
            <Route path="/scanner" element={<ScannerPage t={t} lang={language} />} />
            <Route path="*" element={<NotFoundPage t={t} />} />
          </Routes>
        </Suspense>

        <Footer copyrightText={t.footerCopyright} />
      </div>
    </Router>
  )
}

export default App
