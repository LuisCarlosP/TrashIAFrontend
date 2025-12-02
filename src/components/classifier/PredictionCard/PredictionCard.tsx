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
        <p>{getMaterialMessage(prediction.clase)}</p>
      </div>

      <div className="advice-section">
        <h3>
          <FontAwesomeIcon icon={faRecycle} />
          {t.recyclingTips}
        </h3>
        <p>{getRecyclingAdvice(prediction.clase, prediction.es_reciclable)}</p>
      </div>
    </div>
  )
}
