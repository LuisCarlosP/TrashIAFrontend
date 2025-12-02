import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import './MapFilters.css'

interface FilterOption {
  key: string
  label: string
  icon: IconDefinition
}

interface MapFiltersProps {
  options: FilterOption[]
  selectedTypes: string[]
  onToggleFilter: (type: string) => void
  onClearFilters: () => void
  clearFiltersText: string
}

export default function MapFilters({
  options,
  selectedTypes,
  onToggleFilter,
  onClearFilters,
  clearFiltersText
}: MapFiltersProps) {
  return (
    <div className="filter-panel">
      <div className="filter-options">
        {options.map(option => (
          <button
            key={option.key}
            className={`filter-chip ${selectedTypes.includes(option.key) ? 'active' : ''}`}
            onClick={() => onToggleFilter(option.key)}
          >
            <FontAwesomeIcon icon={option.icon} className="filter-icon" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      {selectedTypes.length > 0 && (
        <button className="btn-clear-filters" onClick={onClearFilters}>
          {clearFiltersText}
        </button>
      )}
    </div>
  )
}
