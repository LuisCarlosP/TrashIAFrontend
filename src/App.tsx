import { useState, lazy, Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { translations, type Language } from './translations'
import { Header, Footer, Loading } from './components'

// Lazy load pages para mejor rendimiento inicial
const HomePage = lazy(() => import('./pages/HomePage/HomePage'))
const ClassifierPage = lazy(() => import('./pages/Classifier/ClassifierPage'))
const RecyclingMap = lazy(() => import('./pages/Map/RecyclingMap'))

function App() {
  const [language, setLanguage] = useState<Language>('es')
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
            menuToggle: t.menuToggle
          }}
        />

        <Suspense fallback={<Loading message="Cargando..." />}>
          <Routes>
            <Route path="/" element={<HomePage t={t} />} />
            <Route path="/trashia" element={<ClassifierPage language={language} t={t} />} />
            <Route path="/map" element={<RecyclingMap t={t} />} />
          </Routes>
        </Suspense>

        <Footer copyrightText={t.footerCopyright} />
      </div>
    </Router>
  )
}

export default App
