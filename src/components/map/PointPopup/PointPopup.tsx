import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMapMarkerAlt, 
  faClock, 
  faRoute, 
  faPhone, 
  faGlobe,
  type IconDefinition 
} from '@fortawesome/free-solid-svg-icons'
import type { RecyclingPoint } from '../../../services/location'
import './PointPopup.css'

interface PointPopupProps {
  point: RecyclingPoint
  formatDistance: (meters: number) => string
  translateType: (type: string) => string
  getIconForType: (type: string) => IconDefinition
  onGetDirections: (point: RecyclingPoint) => void
  translations: {
    accepts: string
    getDirections: string
    call: string
    openWebsite: string
  }
}

export default function PointPopup({
  point,
  formatDistance,
  translateType,
  getIconForType,
  onGetDirections,
  translations: t
}: PointPopupProps) {
  return (
    <div className="point-popup">
      <h3>{point.name}</h3>
      
      {point.address && (
        <p className="popup-address">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          {point.address}
        </p>
      )}
      
      {point.distance && (
        <p className="popup-distance">
          {formatDistance(point.distance)}
        </p>
      )}
      
      <div className="popup-types">
        <strong>{t.accepts}:</strong>
        <div className="types-list">
          {point.types.map(type => (
            <span key={type} className="type-badge">
              <FontAwesomeIcon icon={getIconForType(type)} /> {translateType(type)}
            </span>
          ))}
        </div>
      </div>

      {point.openingHours && (
        <p className="popup-hours">
          <FontAwesomeIcon icon={faClock} />
          {point.openingHours}
        </p>
      )}

      <div className="popup-actions">
        <button 
          className="popup-btn primary"
          onClick={() => onGetDirections(point)}
        >
          <FontAwesomeIcon icon={faRoute} />
          {t.getDirections}
        </button>
        
        {point.phone && (
          <a href={`tel:${point.phone}`} className="popup-btn">
            <FontAwesomeIcon icon={faPhone} />
            {t.call}
          </a>
        )}
        
        {point.website && (
          <a 
            href={point.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="popup-btn"
          >
            <FontAwesomeIcon icon={faGlobe} />
            {t.openWebsite}
          </a>
        )}
      </div>
    </div>
  )
}
