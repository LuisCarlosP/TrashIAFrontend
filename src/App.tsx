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
  faStop
} from '@fortawesome/free-solid-svg-icons'

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
      displayImagePreview(file)
    } else {
      setError('Por favor, suelta una imagen válida')
    }
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
      setError(err instanceof Error ? err.message : 'Error desconocido')
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
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
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
      setError('La cámara aún no está lista. Espera un momento e intenta nuevamente.')
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setImageFile(null)
    setPrediction(null)
    setError(null)
    stopCamera()
  }

  const getClassNameInSpanish = (className: string): string => {
    const translations: Record<string, string> = {
      'cardboard': 'Cartón',
      'glass': 'Vidrio',
      'metal': 'Metal',
      'paper': 'Papel',
      'plastic': 'Plástico',
      'trash': 'Basura General'
    }
    return translations[className] || className
  }

  const getRecyclingAdvice = (className: string, isRecyclable: boolean): string => {
    const advice: Record<string, string> = {
      'cardboard': 'Aplana las cajas de cartón para ahorrar espacio. Retira cintas adhesivas y grapas. Deposita en el contenedor azul.',
      'glass': 'Enjuaga el vidrio antes de reciclarlo. Retira tapas y corchos. Los espejos y cristales de ventanas NO van en el contenedor de vidrio.',
      'metal': 'Aplasta las latas para reducir volumen. Enjuaga los envases metálicos. Deposita en el contenedor amarillo junto con plásticos.',
      'paper': 'Asegúrate de que el papel esté limpio y seco. El papel sucio o mojado contamina el reciclaje. Deposita en el contenedor azul.',
      'plastic': 'Enjuaga los envases plásticos. Separa las tapas del envase. Reduce el volumen aplastando las botellas. Deposita en el contenedor amarillo.',
      'trash': 'Este material no es reciclable y debe ir al contenedor de basura general. Considera reducir el consumo de materiales no reciclables.'
    }
    
    if (!isRecyclable) {
      return 'Este material no es reciclable. Deposítalo en el contenedor de basura general. Intenta reducir el uso de productos similares.'
    }
    
    return advice[className] || 'Consulta las normas de reciclaje de tu localidad para más información.'
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">
            <FontAwesomeIcon icon={faRecycle} className="header-icon" />
            TrashIA
          </h1>
          <p className="subtitle">Clasificador Inteligente de Residuos</p>
        </div>
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
              <h2>Arrastra tu imagen aquí</h2>
              <p>o haz clic para seleccionar</p>
              
              <div className="button-group">
                <button 
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FontAwesomeIcon icon={faImage} />
                  Seleccionar Imagen
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={startCamera}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  Tomar Foto
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                <span>Cámara Activa - Posiciona el objeto</span>
              </div>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="camera-video"
              />
              <div className="camera-info">
                <p>Asegúrate de que el objeto esté bien iluminado y enfocado</p>
              </div>
              <div className="camera-controls">
                <button className="btn btn-capture" onClick={capturePhoto}>
                  <FontAwesomeIcon icon={faCamera} />
                  Capturar Foto
                </button>
                <button className="btn btn-cancel" onClick={stopCamera}>
                  <FontAwesomeIcon icon={faStop} />
                  Cancelar
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
                <p className="analyze-instruction">Imagen cargada. Haz clic en el botón para analizarla.</p>
                <button className="btn btn-analyze" onClick={analyzeImage}>
                  <FontAwesomeIcon icon={faRecycle} />
                  Analizar Residuo
                </button>
              </div>
            )}

            {loading && (
              <div className="loading">
                <FontAwesomeIcon icon={faSpinner} className="spinner" spin />
                <p>Analizando imagen...</p>
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
                  <h2>{getClassNameInSpanish(prediction.clase)}</h2>
                </div>
                
                <div className="confidence">
                  <span>Confianza: </span>
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
                  {prediction.es_reciclable ? 'Reciclable' : 'No Reciclable'}
                </div>

                <div className="info-message">
                  <h3>Información del material</h3>
                  <p>{prediction.mensaje}</p>
                </div>

                <div className="advice-section">
                  <h3>
                    <FontAwesomeIcon icon={faRecycle} />
                    Consejos de Reciclaje
                  </h3>
                  <p>{getRecyclingAdvice(prediction.clase, prediction.es_reciclable)}</p>
                </div>
              </div>
            )}

            <button className="btn btn-reset" onClick={reset}>
              <FontAwesomeIcon icon={faRotateRight} />
              Analizar Otro Residuo
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>TrashIA - Ayudando a clasificar residuos con Inteligencia Artificial</p>
      </footer>
    </div>
  )
}

export default App
