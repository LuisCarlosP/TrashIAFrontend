import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faFilter } from '@fortawesome/free-solid-svg-icons'
import './MapControls.css'

interface MapControlsProps {
  onCenterOnMe: () => void
  onToggleFilters: () => void
  showFilters: boolean
  selectedFiltersCount: number
  searchRadius: number
  onRadiusChange: (radius: number) => void
  translations: {
    centerOnMe: string
    filters: string
    searchRadius: string
  }
}

export default function MapControls({
  onCenterOnMe,
  onToggleFilters,
  showFilters,
  selectedFiltersCount,
  searchRadius,
  onRadiusChange,
  translations: t
}: MapControlsProps) {
  return (
    <div className="map-controls">
      <button className="btn btn-control" onClick={onCenterOnMe}>
        <FontAwesomeIcon icon={faLocationCrosshairs} />
        <span>{t.centerOnMe}</span>
      </button>
      
      <button 
        className={`btn btn-control ${showFilters ? 'active' : ''}`} 
        onClick={onToggleFilters}
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>{t.filters}</span>
        {selectedFiltersCount > 0 && (
          <span className="filter-badge">{selectedFiltersCount}</span>
        )}
      </button>

      <div className="radius-control">
        <label>{t.searchRadius}</label>
        <select 
          value={searchRadius} 
          onChange={(e) => onRadiusChange(Number(e.target.value))}
        >
          <option value={1000}>1 km</option>
          <option value={2000}>2 km</option>
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={20000}>20 km</option>
        </select>
      </div>
    </div>
  )
}
