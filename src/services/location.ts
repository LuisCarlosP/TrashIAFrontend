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
  radiusMeters: number = 5000,
  types?: string[]
): Promise<RecyclingPoint[]> => {
  try {
    // Build query params
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radiusMeters.toString(),
    });
    
    if (types && types.length > 0) {
      params.append('types', types.join(','));
    }

    const response = await fetch(`${API_URL}/location/recycling-points?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch recycling points');
    }

    const data: RecyclingPointsResponse = await response.json();
    
    // Map backend response to frontend format (convert snake_case to camelCase)
    return data.points.map(point => ({
      ...point,
      openingHours: point.openingHours || (point as any).opening_hours,
    }));
  } catch (error) {
    console.error('Error fetching recycling points from backend:', error);
    
    // Fallback to direct Overpass API if backend fails
    console.log('Falling back to direct Overpass API...');
    return fetchRecyclingPointsFromOverpass(latitude, longitude, radiusMeters);
  }
};

// Fallback: Query OpenStreetMap Overpass API directly
const fetchRecyclingPointsFromOverpass = async (
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<RecyclingPoint[]> => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="recycling"](around:${radiusMeters},${latitude},${longitude});
      node["recycling_type"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="recycling"](around:${radiusMeters},${latitude},${longitude});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recycling points');
    }

    const data = await response.json();
    
    const points: RecyclingPoint[] = data.elements
      .filter((el: any) => el.type === 'node' && el.lat && el.lon)
      .map((el: any) => {
        const types: string[] = [];
        
        // Check for recycling types in tags
        if (el.tags) {
          if (el.tags['recycling:plastic'] === 'yes') types.push('plastic');
          if (el.tags['recycling:glass'] === 'yes' || el.tags['recycling:glass_bottles'] === 'yes') types.push('glass');
          if (el.tags['recycling:paper'] === 'yes') types.push('paper');
          if (el.tags['recycling:cardboard'] === 'yes') types.push('cardboard');
          if (el.tags['recycling:cans'] === 'yes' || el.tags['recycling:scrap_metal'] === 'yes') types.push('metal');
          if (el.tags['recycling:batteries'] === 'yes') types.push('batteries');
          if (el.tags['recycling:electrical_appliances'] === 'yes' || el.tags['recycling:small_appliances'] === 'yes') types.push('electronics');
          if (el.tags['recycling:clothes'] === 'yes') types.push('clothes');
        }

        // If no specific types found, mark as general
        if (types.length === 0) {
          types.push('general');
        }

        const distance = calculateDistance(latitude, longitude, el.lat, el.lon);

        return {
          id: el.id.toString(),
          name: el.tags?.name || el.tags?.operator || 'Recycling Point',
          latitude: el.lat,
          longitude: el.lon,
          address: el.tags?.['addr:street'] 
            ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`
            : undefined,
          types,
          openingHours: el.tags?.opening_hours,
          phone: el.tags?.phone,
          website: el.tags?.website,
          distance,
        };
      })
      .sort((a: RecyclingPoint, b: RecyclingPoint) => (a.distance || 0) - (b.distance || 0));

    return points;
  } catch (error) {
    console.error('Error fetching recycling points from Overpass:', error);
    throw error;
  }
};

// Get Font Awesome icon class for material type
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

// Get color for material type (for map markers)
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
