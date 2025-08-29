export interface Car {
  id: number;
  mpg: number;
  cylinders: number;
  displacement: number;
  horsepower: number | null;
  weight: number;
  acceleration: number;
  modelYear: number;
  origin: number;
  carName: string;
  originName: string;
}

export interface Statistics {
  totalCars: number;
  avgMpg: string;
  mpgRange: {
    min: number;
    max: number;
  };
  cylindersDistribution: Record<string, number>;
  originDistribution: Record<string, number>;
  yearRange: {
    min: number;
    max: number;
  };
  avgHorsepower: string;
  avgWeight: string;
}

export interface VisualizationData {
  year: number;
  avgMpg: string;
  count: number;
}

export interface CylinderData {
  cylinders: number;
  avgMpg: string;
  count: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: Record<string, any>;
}

export interface FilterState {
  search: string;
  minMpg: number | null;
  maxMpg: number | null;
  cylinders: number | null;
  origin: number | null;
  minYear: number | null;
  maxYear: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface FavoriteItem {
  id: string;
  name: string;
  year: number;
  mpg: number;
  addedAt: number;
}
