import './UploadSection.css'
import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faImage, faCamera } from '@fortawesome/free-solid-svg-icons'

interface UploadSectionProps {
  isDragging: boolean
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
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onStartCamera,
  translations: t
}: UploadSectionProps) {
  const inputId = 'file-upload-input'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e)
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
          <label htmlFor={inputId} className="btn btn-primary">
            <FontAwesomeIcon icon={faImage} />
            {t.selectImage}
          </label>
          
          <button 
            className="btn btn-secondary"
            onClick={onStartCamera}
            type="button"
          >
            <FontAwesomeIcon icon={faCamera} />
            {t.takePhoto}
          </button>
        </div>

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
