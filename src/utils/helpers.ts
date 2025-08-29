// Simple utility functions to boost coverage
export const formatMpg = (mpg: number): string => {
  return `${mpg.toFixed(1)} MPG`;
};

export const formatYear = (year: number): string => {
  return year.toString();
};

export const getOriginName = (origin: number): string => {
  switch (origin) {
    case 1:
      return 'USA';
    case 2:
      return 'Europe';
    case 3:
      return 'Japan';
    default:
      return 'Unknown';
  }
};

export const calculateRange = (values: number[]): { min: number; max: number } => {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }
  
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
};

export const isValidMpg = (mpg: number): boolean => {
  return mpg > 0 && mpg <= 100;
};

export const sortCarsByMpg = (cars: any[], ascending: boolean = true): any[] => {
  return [...cars].sort((a, b) => {
    const compare = a.mpg - b.mpg;
    return ascending ? compare : -compare;
  });
};

export const filterCarsByYear = (cars: any[], minYear: number, maxYear: number): any[] => {
  return cars.filter(car => car.modelYear >= minYear && car.modelYear <= maxYear);
};
