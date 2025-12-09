import './CameraSection.css'
import type { RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faCamera, faStop } from '@fortawesome/free-solid-svg-icons'

interface CameraSectionProps {
  videoRef: RefObject<HTMLVideoElement | null>
  onCapture: () => void
  onStop: () => void
  translations: {
    cameraActive: string
    cameraInfo: string
    capturePhoto: string
    cancel: string
  }
}

export default function CameraSection({
  videoRef,
  onCapture,
  onStop,
  translations: t
}: CameraSectionProps) {
  return (
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
          <button className="btn btn-capture" onClick={onCapture}>
            <FontAwesomeIcon icon={faCamera} />
            {t.capturePhoto}
          </button>
          <button className="btn btn-cancel" onClick={onStop}>
            <FontAwesomeIcon icon={faStop} />
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
