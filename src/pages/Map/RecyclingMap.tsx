import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
  faBottleWater,
  faWineBottle,
  faFile,
  faBox,
  faRing,
  faBatteryFull,
  faMobileScreen,
  faShirt,
  faRecycle,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { renderToString } from 'react-dom/server'
import {
  getCurrentPosition,
  fetchRecyclingPoints,
  formatDistance,
  type Coordinates,
  type RecyclingPoint
} from '../../services/location'
import { MapHeader, MapControls, MapFilters, PointPopup } from '../../components/map'
import { Loading } from '../../components'
import 'leaflet/dist/leaflet.css'
import './RecyclingMap.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const materialIcons: Record<string, IconDefinition> = {
  plastic: faBottleWater,
  glass: faWineBottle,
  paper: faFile,
  cardboard: faBox,
  metal: faRing,
  batteries: faBatteryFull,
  electronics: faMobileScreen,
  clothes: faShirt,
  general: faRecycle,
}

const getIconForType = (type: string): IconDefinition => {
  return materialIcons[type] || faRecycle
}

const createCustomIcon = (color: string, materialType: string) => {
  const icon = getIconForType(materialType)
  const iconHtml = renderToString(
    <FontAwesomeIcon icon={icon} style={{ color: 'white', fontSize: '16px' }} />
  )

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container" style="background-color: ${color}">
        <span class="marker-icon">${iconHtml}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="user-marker-container">
      <div class="user-marker-pulse"></div>
      <div class="user-marker-dot"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

interface RecyclingMapProps {
  t: {
    mapTitle: string
    mapSubtitle: string
    loadingLocation: string
    loadingPoints: string
    errorLocation: string
    errorPoints: string
    retry: string
    centerOnMe: string
    filters: string
    allTypes: string
    noPointsFound: string
    pointsFound: string
    getDirections: string
    openWebsite: string
    call: string
    openingHours: string
    accepts: string
    filterPlastic: string
    filterGlass: string
    filterPaper: string
    filterCardboard: string
    filterMetal: string
    filterElectronics: string
    filterBatteries: string
    filterClothes: string
    filterGeneral: string
    searchRadius: string
    typePlastic: string
    typeGlass: string
    typePaper: string
    typeCardboard: string
    typeMetal: string
    typeElectronics: string
    typeBatteries: string
    typeClothes: string
    typeGeneral: string
    typeOrganic: string
    typeTextile: string
    typeOil: string
    typeMedicine: string
  }
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])
  return null
}

export default function RecyclingMap({ t }: RecyclingMapProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [recyclingPoints, setRecyclingPoints] = useState<RecyclingPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [searchRadius, setSearchRadius] = useState(2000)
  const [shouldRecenter, setShouldRecenter] = useState(false)

  const translateType = (type: string): string => {
    const typeTranslations: Record<string, string> = {
      plastic: t.typePlastic,
      glass: t.typeGlass,
      paper: t.typePaper,
      cardboard: t.typeCardboard,
      metal: t.typeMetal,
      electronics: t.typeElectronics,
      batteries: t.typeBatteries,
      clothes: t.typeClothes,
      general: t.typeGeneral,
      organic: t.typeOrganic,
      textile: t.typeTextile,
      oil: t.typeOil,
      medicine: t.typeMedicine,
    }
    return typeTranslations[type.toLowerCase()] || type
  }

  const filterOptions = [
    { key: 'plastic', label: t.filterPlastic, icon: faBottleWater },
    { key: 'glass', label: t.filterGlass, icon: faWineBottle },
    { key: 'paper', label: t.filterPaper, icon: faFile },
    { key: 'cardboard', label: t.filterCardboard, icon: faBox },
    { key: 'metal', label: t.filterMetal, icon: faRing },
    { key: 'electronics', label: t.filterElectronics, icon: faMobileScreen },
    { key: 'batteries', label: t.filterBatteries, icon: faBatteryFull },
    { key: 'clothes', label: t.filterClothes, icon: faShirt },
    { key: 'general', label: t.filterGeneral, icon: faRecycle },
  ]

  useEffect(() => {
    loadUserLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadRecyclingPoints()
    }
  }, [userLocation, searchRadius])

  const loadUserLocation = async () => {
    setLoading(true)
    setError(null)
    try {
      const coords = await getCurrentPosition()
      setUserLocation(coords)
    } catch {
      setError(t.errorLocation)
      setUserLocation({ latitude: 40.4168, longitude: -3.7038 })
    } finally {
      setLoading(false)
    }
  }

  const loadRecyclingPoints = useCallback(async () => {
    if (!userLocation) return

    setLoadingPoints(true)
    try {
      const points = await fetchRecyclingPoints(
        userLocation.latitude,
        userLocation.longitude,
        searchRadius
      )
      setRecyclingPoints(points)
    } catch {
      console.error('Error loading points')
    } finally {
      setLoadingPoints(false)
    }
  }, [userLocation, searchRadius])

  const handleCenterOnMe = () => {
    loadUserLocation()
    setShouldRecenter(true)
    setTimeout(() => setShouldRecenter(false), 100)
  }

  const toggleFilter = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
  }

  const filteredPoints = selectedTypes.length === 0
    ? recyclingPoints
    : recyclingPoints.filter(point =>
      point.types.some(type => selectedTypes.includes(type))
    )

  const openDirections = (point: RecyclingPoint) => {
    if (!userLocation) return
    const origin = `${userLocation.latitude},${userLocation.longitude}`
    const destination = `${point.latitude},${point.longitude}`
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="map-page">
        <div className="map-loading-wrapper">
          <Loading message={t.loadingLocation} />
        </div>
      </div>
    )
  }

  if (!userLocation) {
    return (
      <div className="map-page">
        <div className="map-error">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          <p>{error || t.errorLocation}</p>
          <button className="btn btn-retry" onClick={loadUserLocation}>
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-page">
      <MapHeader
        title={t.mapTitle}
        subtitle={t.mapSubtitle}
        pointsCount={filteredPoints.length}
        isLoading={loadingPoints}
        loadingText={t.loadingPoints}
        pointsFoundText={t.pointsFound}
      />

      <MapControls
        onCenterOnMe={handleCenterOnMe}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        selectedFiltersCount={selectedTypes.length}
        searchRadius={searchRadius}
        onRadiusChange={setSearchRadius}
        translations={{
          centerOnMe: t.centerOnMe,
          filters: t.filters,
          searchRadius: t.searchRadius
        }}
      />

      {showFilters && (
        <MapFilters
          options={filterOptions}
          selectedTypes={selectedTypes}
          onToggleFilter={toggleFilter}
          onClearFilters={clearFilters}
          clearFiltersText={t.allTypes}
        />
      )}

      <div className="map-container">
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={14}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="user-popup">
                <strong>Tu ubicación</strong>
              </div>
            </Popup>
          </Marker>

          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={searchRadius}
            pathOptions={{
              color: '#2e7d32',
              fillColor: '#2e7d32',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />

          {filteredPoints.map(point => (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={createCustomIcon('#2e7d32', point.types[0] || 'general')}
            >
              <Popup>
                <PointPopup
                  point={point}
                  formatDistance={formatDistance}
                  translateType={translateType}
                  getIconForType={getIconForType}
                  onGetDirections={openDirections}
                  translations={{
                    accepts: t.accepts,
                    getDirections: t.getDirections,
                    call: t.call,
                    openWebsite: t.openWebsite
                  }}
                />
              </Popup>
            </Marker>
          ))}

          {shouldRecenter && (
            <RecenterMap position={[userLocation.latitude, userLocation.longitude]} />
          )}
        </MapContainer>
      </div>

      {!loadingPoints && filteredPoints.length === 0 && (
        <div className="no-points-message">
          <p>{t.noPointsFound}</p>
        </div>
      )}
    </div>
  )
}
