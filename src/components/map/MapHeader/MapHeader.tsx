import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import './MapHeader.css'

interface MapHeaderProps {
  title: string
  subtitle: string
  pointsCount: number
  isLoading: boolean
  loadingText: string
  pointsFoundText: string
}

export default function MapHeader({
  title,
  subtitle,
  pointsCount,
  isLoading,
  loadingText,
  pointsFoundText
}: MapHeaderProps) {
  return (
    <div className="map-header">
      <div className="map-header-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="map-stats">
        {isLoading ? (
          <span className="loading-text">
            <FontAwesomeIcon icon={faSpinner} spin /> {loadingText}
          </span>
        ) : (
          <span className="points-count">
            {pointsCount} {pointsFoundText}
          </span>
        )}
      </div>
    </div>
  )
}
