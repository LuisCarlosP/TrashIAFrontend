import './PredictionCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecycle, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import type { PredictionResponse } from '../../../services/Classifier'

interface PredictionCardProps {
  prediction: PredictionResponse
  getClassName: (className: string) => string
  getMaterialMessage: (className: string) => string
  getRecyclingAdvice: (className: string, isRecyclable: boolean) => string
  translations: {
    confidence: string
    recyclable: string
    notRecyclable: string
    materialInfo: string
    recyclingTips: string
  }
}

export default function PredictionCard({
  prediction,
  getClassName,
  getMaterialMessage,
  getRecyclingAdvice,
  translations: t
}: PredictionCardProps) {
  return (
    <div className={`prediction-card ${prediction.is_recyclable ? 'recyclable' : 'non-recyclable'}`}>
      <div className="prediction-header">
        <FontAwesomeIcon 
          icon={prediction.is_recyclable ? faRecycle : faCircleXmark} 
          className="prediction-icon"
        />
        <h2>{getClassName(prediction.class)}</h2>
      </div>
      
      <div className="confidence">
        <span>{t.confidence}: </span>
        <strong>{(prediction.confidence * 100).toFixed(1)}%</strong>
      </div>

      <div className="confidence-bar">
        <div 
          className="confidence-fill" 
          style={{ width: `${prediction.confidence * 100}%` }}
        ></div>
      </div>

      <div className={`recyclable-badge ${prediction.is_recyclable ? 'yes' : 'no'}`}>
        <FontAwesomeIcon icon={prediction.is_recyclable ? faCircleCheck : faCircleXmark} />
        {prediction.is_recyclable ? t.recyclable : t.notRecyclable}
      </div>

      <div className="info-message">
        <h3>{t.materialInfo}</h3>
        <p>{prediction.message || getMaterialMessage(prediction.class)}</p>
      </div>

      <div className="advice-section">
        <h3>
          <FontAwesomeIcon icon={faRecycle} />
          {t.recyclingTips}
        </h3>
        <p>{getRecyclingAdvice(prediction.class, prediction.is_recyclable)}</p>
      </div>
    </div>
  )
}
