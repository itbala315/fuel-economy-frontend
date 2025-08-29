// Additional utility functions for better test coverage
export const validateCarData = (car: any): boolean => {
  if (!car || typeof car !== 'object') return false;
  
  const requiredFields = ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'modelYear', 'origin', 'carName'];
  return requiredFields.every(field => car.hasOwnProperty(field));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateFuelCost = (mpg: number, milesPerYear: number, fuelPricePerGallon: number): number => {
  if (mpg <= 0) return 0;
  const gallonsPerYear = milesPerYear / mpg;
  return gallonsPerYear * fuelPricePerGallon;
};

export const getEfficiencyRating = (mpg: number): string => {
  if (mpg >= 40) return 'Excellent';
  if (mpg >= 30) return 'Good';
  if (mpg >= 20) return 'Average';
  if (mpg >= 15) return 'Below Average';
  return 'Poor';
};

export const convertWeight = (weightInPounds: number, unit: 'kg' | 'tons' = 'kg'): number => {
  if (unit === 'kg') {
    return Math.round(weightInPounds * 0.453592);
  }
  if (unit === 'tons') {
    return Math.round((weightInPounds * 0.453592) / 1000 * 100) / 100;
  }
  return weightInPounds;
};

export const getDecadeFromYear = (year: number): string => {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
};

export const groupCarsByOrigin = (cars: any[]): Record<string, any[]> => {
  return cars.reduce((groups, car) => {
    const origin = car.originName || 'Unknown';
    if (!groups[origin]) {
      groups[origin] = [];
    }
    groups[origin].push(car);
    return groups;
  }, {});
};

export const calculateAverageByField = (cars: any[], field: string): number => {
  if (!cars.length) return 0;
  const total = cars.reduce((sum, car) => sum + (car[field] || 0), 0);
  return Math.round((total / cars.length) * 100) / 100;
};

export const findExtremeValues = (cars: any[], field: string): { min: number; max: number } => {
  if (!cars.length) return { min: 0, max: 0 };
  
  const values = cars.map(car => car[field] || 0).filter(val => val > 0);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
};

export const filterCarsByDecade = (cars: any[], decade: string): any[] => {
  const decadeStart = parseInt(decade.replace('s', ''));
  const decadeEnd = decadeStart + 9;
  
  return cars.filter(car => 
    car.modelYear >= decadeStart && car.modelYear <= decadeEnd
  );
};

export const generateCarId = (car: any): string => {
  const cleanName = car.carName.replace(/\s+/g, '-').toLowerCase();
  return `${car.modelYear}-${cleanName}`;
};

export const isElectricVehicle = (car: any): boolean => {
  // Simple heuristic - very high MPG might indicate electric/hybrid
  return car.mpg > 50;
};

export const getEnvironmentalImpact = (mpg: number): { co2: number; rating: string } => {
  // CO2 emissions in pounds per gallon of gasoline burned
  const co2PerGallon = 19.6;
  const milesPerYear = 15000;
  
  const gallonsPerYear = milesPerYear / mpg;
  const co2PerYear = gallonsPerYear * co2PerGallon;
  
  let rating = 'High Impact';
  if (co2PerYear < 4000) rating = 'Low Impact';
  else if (co2PerYear < 6000) rating = 'Medium Impact';
  
  return {
    co2: Math.round(co2PerYear),
    rating
  };
};
