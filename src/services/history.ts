// History Service - Manages classification history in localStorage

export interface ClassificationRecord {
  id: string;
  material: string;
  confidence: number;
  isRecyclable: boolean;
  timestamp: string;
  imagePreview?: string; // Base64 thumbnail
}

export interface UserStats {
  totalClassifications: number;
  recyclableCount: number;
  nonRecyclableCount: number;
  byMaterial: Record<string, number>;
  co2Saved: number; // in kg
  waterSaved: number; // in liters
  energySaved: number; // in kWh
  treesEquivalent: number;
  lastClassification?: string;
  streakDays: number;
  weeklyClassifications: number[];
}

// Environmental impact per material (approximate values per item)
const ENVIRONMENTAL_IMPACT = {
  plastic: { co2: 0.04, water: 3, energy: 0.08 },      // Per plastic bottle
  glass: { co2: 0.3, water: 2, energy: 0.15 },         // Per glass bottle
  metal: { co2: 0.5, water: 5, energy: 0.25 },         // Per aluminum can
  paper: { co2: 0.02, water: 10, energy: 0.05 },       // Per paper sheet bundle
  cardboard: { co2: 0.1, water: 15, energy: 0.1 },     // Per cardboard box
  trash: { co2: 0, water: 0, energy: 0 },              // No savings for trash
};

// CO2 absorbed by one tree per year (in kg)
const CO2_PER_TREE_PER_YEAR = 22;

const HISTORY_KEY = 'trashia_history';
const STATS_KEY = 'trashia_stats';
const MAX_RECORDS = 100;
const MAX_IMAGE_SIZE = 50; // Thumbnail size in pixels

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create thumbnail from image file
export const createThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions maintaining aspect ratio
        const ratio = Math.min(MAX_IMAGE_SIZE / img.width, MAX_IMAGE_SIZE / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

// Get classification history
export const getHistory = (): ClassificationRecord[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save a new classification
export const saveClassification = async (
  material: string,
  confidence: number,
  isRecyclable: boolean,
  imageFile?: File
): Promise<ClassificationRecord> => {
  const history = getHistory();
  
  let imagePreview: string | undefined;
  if (imageFile) {
    imagePreview = await createThumbnail(imageFile);
  }
  
  const newRecord: ClassificationRecord = {
    id: generateId(),
    material: material.toLowerCase(),
    confidence,
    isRecyclable,
    timestamp: new Date().toISOString(),
    imagePreview,
  };
  
  history.unshift(newRecord);
  
  // Keep only last MAX_RECORDS
  const trimmedHistory = history.slice(0, MAX_RECORDS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  
  // Update cached stats
  updateStatsCache(trimmedHistory);
  
  return newRecord;
};

// Delete a classification record
export const deleteClassification = (id: string): void => {
  const history = getHistory().filter(record => record.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  updateStatsCache(history);
};

// Clear all history
export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(STATS_KEY);
};

// Calculate streak days
const calculateStreak = (history: ClassificationRecord[]): number => {
  if (history.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dates = new Set(
    history.map(record => {
      const date = new Date(record.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  let streak = 0;
  let currentDate = today.getTime();
  
  while (dates.has(currentDate)) {
    streak++;
    currentDate -= 24 * 60 * 60 * 1000; // Go back one day
  }
  
  return streak;
};

// Get weekly classification counts (last 7 days)
const getWeeklyClassifications = (history: ClassificationRecord[]): number[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekData: number[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(today);
    dayStart.setDate(dayStart.getDate() - i);
    
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    
    const count = history.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= dayStart && recordDate < dayEnd;
    }).length;
    
    weekData.push(count);
  }
  
  return weekData;
};

// Calculate environmental impact
const calculateEnvironmentalImpact = (history: ClassificationRecord[]) => {
  let co2 = 0;
  let water = 0;
  let energy = 0;
  
  history
    .filter(record => record.isRecyclable)
    .forEach(record => {
      const impact = ENVIRONMENTAL_IMPACT[record.material as keyof typeof ENVIRONMENTAL_IMPACT];
      if (impact) {
        co2 += impact.co2;
        water += impact.water;
        energy += impact.energy;
      }
    });
  
  return {
    co2: Math.round(co2 * 100) / 100,
    water: Math.round(water * 100) / 100,
    energy: Math.round(energy * 100) / 100,
    trees: Math.round((co2 / CO2_PER_TREE_PER_YEAR) * 100) / 100,
  };
};

// Update stats cache
const updateStatsCache = (history: ClassificationRecord[]): void => {
  const stats = calculateStats(history);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Calculate all stats from history
const calculateStats = (history: ClassificationRecord[]): UserStats => {
  const byMaterial: Record<string, number> = {};
  let recyclableCount = 0;
  let nonRecyclableCount = 0;
  
  history.forEach(record => {
    byMaterial[record.material] = (byMaterial[record.material] || 0) + 1;
    if (record.isRecyclable) {
      recyclableCount++;
    } else {
      nonRecyclableCount++;
    }
  });
  
  const impact = calculateEnvironmentalImpact(history);
  
  return {
    totalClassifications: history.length,
    recyclableCount,
    nonRecyclableCount,
    byMaterial,
    co2Saved: impact.co2,
    waterSaved: impact.water,
    energySaved: impact.energy,
    treesEquivalent: impact.trees,
    lastClassification: history[0]?.timestamp,
    streakDays: calculateStreak(history),
    weeklyClassifications: getWeeklyClassifications(history),
  };
};

// Get user stats (from cache or calculate)
export const getStats = (): UserStats => {
  try {
    const cached = localStorage.getItem(STATS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Calculate from history if cache fails
  }
  
  const history = getHistory();
  const stats = calculateStats(history);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
};

// Get recent classifications (last N items)
export const getRecentClassifications = (limit: number = 5): ClassificationRecord[] => {
  return getHistory().slice(0, limit);
};

// Get classification count for today
export const getTodayCount = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return getHistory().filter(record => {
    const recordDate = new Date(record.timestamp);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  }).length;
};

// Material display info
export const getMaterialDisplayName = (material: string, language: 'es' | 'en' = 'es'): string => {
  const names: Record<string, Record<string, string>> = {
    plastic: { es: 'Plástico', en: 'Plastic' },
    glass: { es: 'Vidrio', en: 'Glass' },
    metal: { es: 'Metal', en: 'Metal' },
    paper: { es: 'Papel', en: 'Paper' },
    cardboard: { es: 'Cartón', en: 'Cardboard' },
    trash: { es: 'Basura', en: 'Trash' },
  };
  return names[material]?.[language] || material;
};

export const getMaterialColor = (material: string): string => {
  const colors: Record<string, string> = {
    plastic: '#FFC107',
    glass: '#4CAF50',
    metal: '#9E9E9E',
    paper: '#2196F3',
    cardboard: '#795548',
    trash: '#607D8B',
  };
  return colors[material] || '#2e7d32';
};

export const getMaterialIcon = (material: string): string => {
  const icons: Record<string, string> = {
    plastic: 'fa-bottle-water',
    glass: 'fa-wine-bottle',
    metal: 'fa-ring',
    paper: 'fa-file',
    cardboard: 'fa-box',
    trash: 'fa-trash',
  };
  return icons[material] || 'fa-recycle';
};
