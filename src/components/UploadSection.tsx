import './UploadSection.css'
import type { RefObject } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faImage, faCamera } from '@fortawesome/free-solid-svg-icons'

interface UploadSectionProps {
  isDragging: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStartCamera: () => void
  translations: {
    dragImageHere: string
    orClickToSelect: string
    fileRequirements: string
    selectImage: string
    takePhoto: string
  }
}

export default function UploadSection({
  isDragging,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onStartCamera,
  translations: t
}: UploadSectionProps) {
  return (
    <div className="upload-section">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
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
            onClick={onStartCamera}
          >
            <FontAwesomeIcon icon={faCamera} />
            {t.takePhoto}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
