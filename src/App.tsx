import { useState, useRef, type DragEvent } from 'react'
import './App.css'
import { predictImage, type PredictionResponse } from './services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faRecycle, 
  faCamera, 
  faCloudArrowUp, 
  faImage,
  faCircleCheck,
  faCircleXmark,
  faSpinner,
  faRotateRight,
  faCircleExclamation,
  faVideo,
  faStop,
  faLanguage
} from '@fortawesome/free-solid-svg-icons'
import { translations, type Language } from './translations'

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [language, setLanguage] = useState<Language>('es')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!validateFile(file)) return;
      displayImagePreview(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      if (!validateFile(file)) return;
      displayImagePreview(file)
    } else {
      setError(t.invalidFileFormat)
    }
  }

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(t.formatNotAllowed);
      return false;
    }
    
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      setError(`${t.fileTooLarge} ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }
    
    return true;
  }

  const displayImagePreview = (file: File) => {
    // Guardar el archivo para enviar después
    setImageFile(file)
    setError(null)
    setPrediction(null)
    
    // Mostrar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!imageFile) return

    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const result = await predictImage(imageFile)
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unknownError)
    } finally {
      setLoading(false)
    }
  }

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      setShowCamera(true)
      
      // Esperar un momento para que el DOM se actualice
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
        }
      }, 100)
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError(t.cameraAccessError)
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
            stopCamera()
            displayImagePreview(file)
          }
        }, 'image/jpeg', 0.95)
      }
    } else {
      setError(t.cameraNotReady)
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setImageFile(null)
    setPrediction(null)
    setError(null)
    stopCamera()
  }

  const getClassName = (className: string): string => {
    const classTranslations: Record<string, keyof typeof t> = {
      'cardboard': 'cardboard',
      'glass': 'glass',
      'metal': 'metal',
      'paper': 'paper',
      'plastic': 'plastic',
      'trash': 'trash'
    }
    const key = classTranslations[className]
    return key ? t[key] : className
  }

  const getRecyclingAdvice = (className: string, isRecyclable: boolean): string => {
    const adviceKeys: Record<string, keyof typeof t> = {
      'cardboard': 'cardboardAdvice',
      'glass': 'glassAdvice',
      'metal': 'metalAdvice',
      'paper': 'paperAdvice',
      'plastic': 'plasticAdvice',
      'trash': 'trashAdvice'
    }
    
    if (!isRecyclable) {
      return t.notRecyclableAdvice
    }
    
    const key = adviceKeys[className]
    return key ? t[key] : t.defaultAdvice
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">
            <FontAwesomeIcon icon={faRecycle} className="header-icon" />
            {t.appTitle}
          </h1>
          <p className="subtitle">{t.appSubtitle}</p>
        </div>
        <button className="language-toggle" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faLanguage} />
          <span>{language === 'es' ? 'EN' : 'ES'}</span>
        </button>
      </header>

      <main className="main-content">
        {!selectedImage && !showCamera && (
          <div className="upload-section">
            <div 
              className={`dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon icon={faCloudArrowUp} className="dropzone-icon" />
              <h2>{t.dragImageHere}</h2>
              <p>{t.orClickToSelect}</p>
              <p className="file-requirements">{t.fileRequirements}</p>
              
              <div className="button-group">
                <button 
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FontAwesomeIcon icon={faImage} />
                  {t.selectImage}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={startCamera}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  {t.takePhoto}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {showCamera && (
          <div className="camera-section">
            <div className="camera-container">
              <div className="camera-header">
                <FontAwesomeIcon icon={faVideo} />
                <span>{t.cameraActive}</span>
              </div>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="camera-video"
              />
              <div className="camera-info">
                <p>{t.cameraInfo}</p>
              </div>
              <div className="camera-controls">
                <button className="btn btn-capture" onClick={capturePhoto}>
                  <FontAwesomeIcon icon={faCamera} />
                  {t.capturePhoto}
                </button>
                <button className="btn btn-cancel" onClick={stopCamera}>
                  <FontAwesomeIcon icon={faStop} />
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="results-section">
            <div className="image-preview">
              <img src={selectedImage} alt="Imagen seleccionada" />
            </div>

            {!loading && !prediction && (
              <div className="analyze-section">
                <p className="analyze-instruction">{t.imageLoaded}</p>
                <button className="btn btn-analyze" onClick={analyzeImage}>
                  <FontAwesomeIcon icon={faRecycle} />
                  {t.analyzeWaste}
                </button>
              </div>
            )}

            {loading && (
              <div className="loading">
                <FontAwesomeIcon icon={faSpinner} className="spinner" spin />
                <p>{t.analyzing}</p>
              </div>
            )}

            {error && (
              <div className="error-card">
                <FontAwesomeIcon icon={faCircleExclamation} className="error-icon" />
                <p>{error}</p>
              </div>
            )}

            {prediction && (
              <div className={`prediction-card ${prediction.es_reciclable ? 'recyclable' : 'non-recyclable'}`}>
                <div className="prediction-header">
                  <FontAwesomeIcon 
                    icon={prediction.es_reciclable ? faRecycle : faCircleXmark} 
                    className="prediction-icon"
                  />
                  <h2>{getClassName(prediction.clase)}</h2>
                </div>
                
                <div className="confidence">
                  <span>{t.confidence}: </span>
                  <strong>{(prediction.confianza * 100).toFixed(1)}%</strong>
                </div>

                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${prediction.confianza * 100}%` }}
                  ></div>
                </div>

                <div className={`recyclable-badge ${prediction.es_reciclable ? 'yes' : 'no'}`}>
                  <FontAwesomeIcon icon={prediction.es_reciclable ? faCircleCheck : faCircleXmark} />
                  {prediction.es_reciclable ? t.recyclable : t.notRecyclable}
                </div>

                <div className="info-message">
                  <h3>{t.materialInfo}</h3>
                  <p>{prediction.mensaje}</p>
                </div>

                <div className="advice-section">
                  <h3>
                    <FontAwesomeIcon icon={faRecycle} />
                    {t.recyclingTips}
                  </h3>
                  <p>{getRecyclingAdvice(prediction.clase, prediction.es_reciclable)}</p>
                </div>
              </div>
            )}

            <button className="btn btn-reset" onClick={reset}>
              <FontAwesomeIcon icon={faRotateRight} />
              {t.analyzeAnother}
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Luis Carlos Picado Rojas. {t.footerCopyright}</p>
      </footer>
    </div>
  )
}

export default App
