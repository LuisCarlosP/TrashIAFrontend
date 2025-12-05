export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RecyclingPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  types: string[]; // ['plastic', 'glass', 'paper', 'metal', 'cardboard', 'electronics', 'batteries']
  openingHours?: string;
  phone?: string;
  website?: string;
  distance?: number; // in meters
  operator?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface RecyclingPointsResponse {
  success: boolean;
  count: number;
  radius: number;
  center: Coordinates;
  points: RecyclingPoint[];
}

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Get user's current location with high precision
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: 'Geolocation is not supported by this browser' });
      return;
    }

    let bestPosition: GeolocationPosition | null = null;
    let watchId: number;

    const timeoutId = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      if (bestPosition) {
        resolve({
          latitude: bestPosition.coords.latitude,
          longitude: bestPosition.coords.longitude,
        });
      } else {
        reject({ code: 3, message: 'Timeout waiting for accurate position' });
      }
    }, 10000);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }

        if (position.coords.accuracy <= 20) {
          clearTimeout(timeoutId);
          navigator.geolocation.clearWatch(watchId);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        navigator.geolocation.clearWatch(watchId);

        if (bestPosition) {
          resolve({
            latitude: bestPosition.coords.latitude,
            longitude: bestPosition.coords.longitude,
          });
          return;
        }

        let message = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'User denied the request for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            message = 'The request to get user location timed out';
            break;
        }
        reject({ code: error.code, message });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  });
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

// Fetch recycling points from backend API
export const fetchRecyclingPoints = async (
  latitude: number,
  longitude: number,
  radiusMeters: number = 2000,
  types?: string[]
): Promise<RecyclingPoint[]> => {
  // Build query params
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    radius: radiusMeters.toString(),
  });

  if (types && types.length > 0) {
    params.append('types', types.join(','));
  }

  const response = await fetch(`${API_URL}/location/recycling-points?${params}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al buscar puntos de reciclaje');
  }

  const data: RecyclingPointsResponse = await response.json();


  return data.points.map(point => ({
    ...point,
    openingHours: point.openingHours || (point as any).opening_hours,
  }));
};

export const getMaterialIcon = (type: string): string => {
  const icons: Record<string, string> = {
    plastic: 'fa-bottle-water',
    glass: 'fa-wine-bottle',
    paper: 'fa-file',
    cardboard: 'fa-box',
    metal: 'fa-ring',
    batteries: 'fa-battery-full',
    electronics: 'fa-mobile-screen',
    clothes: 'fa-shirt',
    general: 'fa-recycle',
  };
  return icons[type] || 'fa-recycle';
};

export const getMaterialColor = (type: string): string => {
  const colors: Record<string, string> = {
    plastic: '#FFC107',
    glass: '#4CAF50',
    paper: '#2196F3',
    cardboard: '#795548',
    metal: '#9E9E9E',
    batteries: '#FF5722',
    electronics: '#673AB7',
    clothes: '#E91E63',
    general: '#2e7d32',
  };
  return colors[type] || '#2e7d32';
};
