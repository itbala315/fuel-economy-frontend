import {
  validateCarData,
  formatCurrency,
  calculateFuelCost,
  getEfficiencyRating,
  convertWeight,
  getDecadeFromYear,
  groupCarsByOrigin,
  calculateAverageByField,
  findExtremeValues,
  filterCarsByDecade,
  generateCarId,
  isElectricVehicle,
  getEnvironmentalImpact
} from '../car-utils';

describe('Car Utilities', () => {
  const mockCar = {
    mpg: 25.5,
    cylinders: 6,
    displacement: 200,
    horsepower: 150,
    weight: 3000,
    acceleration: 10.5,
    modelYear: 2020,
    origin: 1,
    carName: 'test car',
    originName: 'USA'
  };

  describe('validateCarData', () => {
    test('validates complete car data', () => {
      expect(validateCarData(mockCar)).toBe(true);
    });

    test('rejects invalid car data', () => {
      expect(validateCarData(null)).toBe(false);
      expect(validateCarData({})).toBe(false);
      expect(validateCarData({ mpg: 25 })).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    test('formats currency correctly', () => {
      expect(formatCurrency(1500)).toBe('$1,500.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(99.99)).toBe('$99.99');
    });
  });

  describe('calculateFuelCost', () => {
    test('calculates fuel cost correctly', () => {
      const cost = calculateFuelCost(25, 15000, 3.50);
      expect(cost).toBe(2100);
    });

    test('handles zero MPG', () => {
      expect(calculateFuelCost(0, 15000, 3.50)).toBe(0);
      expect(calculateFuelCost(-5, 15000, 3.50)).toBe(0);
    });
  });

  describe('getEfficiencyRating', () => {
    test('returns correct efficiency ratings', () => {
      expect(getEfficiencyRating(45)).toBe('Excellent');
      expect(getEfficiencyRating(35)).toBe('Good');
      expect(getEfficiencyRating(25)).toBe('Average');
      expect(getEfficiencyRating(18)).toBe('Below Average');
      expect(getEfficiencyRating(12)).toBe('Poor');
    });
  });

  describe('convertWeight', () => {
    test('converts weight to kg', () => {
      expect(convertWeight(2000, 'kg')).toBe(907);
    });

    test('converts weight to tons', () => {
      expect(convertWeight(2000, 'tons')).toBe(0.91);
    });

    test('returns original weight for no unit', () => {
      expect(convertWeight(2000)).toBe(907); // defaults to kg
    });
  });

  describe('getDecadeFromYear', () => {
    test('returns correct decade', () => {
      expect(getDecadeFromYear(1975)).toBe('1970s');
      expect(getDecadeFromYear(1989)).toBe('1980s');
      expect(getDecadeFromYear(2005)).toBe('2000s');
    });
  });

  describe('groupCarsByOrigin', () => {
    test('groups cars by origin', () => {
      const cars = [
        { ...mockCar, originName: 'USA' },
        { ...mockCar, originName: 'Japan' },
        { ...mockCar, originName: 'USA' }
      ];

      const grouped = groupCarsByOrigin(cars);
      expect(grouped.USA).toHaveLength(2);
      expect(grouped.Japan).toHaveLength(1);
    });
  });

  describe('calculateAverageByField', () => {
    test('calculates average correctly', () => {
      const cars = [
        { mpg: 20 },
        { mpg: 30 },
        { mpg: 25 }
      ];

      expect(calculateAverageByField(cars, 'mpg')).toBe(25);
    });

    test('handles empty array', () => {
      expect(calculateAverageByField([], 'mpg')).toBe(0);
    });
  });

  describe('findExtremeValues', () => {
    test('finds min and max values', () => {
      const cars = [
        { mpg: 20 },
        { mpg: 30 },
        { mpg: 15 },
        { mpg: 35 }
      ];

      const extremes = findExtremeValues(cars, 'mpg');
      expect(extremes.min).toBe(15);
      expect(extremes.max).toBe(35);
    });
  });

  describe('filterCarsByDecade', () => {
    test('filters cars by decade', () => {
      const cars = [
        { ...mockCar, modelYear: 1975 },
        { ...mockCar, modelYear: 1985 },
        { ...mockCar, modelYear: 1995 }
      ];

      const filtered = filterCarsByDecade(cars, '1970s');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].modelYear).toBe(1975);
    });
  });

  describe('generateCarId', () => {
    test('generates unique car ID', () => {
      const id = generateCarId(mockCar);
      expect(id).toBe('2020-test-car');
    });
  });

  describe('isElectricVehicle', () => {
    test('identifies potential electric vehicles', () => {
      expect(isElectricVehicle({ mpg: 60 })).toBe(true);
      expect(isElectricVehicle({ mpg: 25 })).toBe(false);
    });
  });

  describe('getEnvironmentalImpact', () => {
    test('calculates environmental impact', () => {
      const impact = getEnvironmentalImpact(30);
      expect(impact.co2).toBeGreaterThan(0);
      expect(typeof impact.rating).toBe('string');
    });

    test('provides different ratings based on efficiency', () => {
      const highEfficiency = getEnvironmentalImpact(50);
      const lowEfficiency = getEnvironmentalImpact(15);
      
      expect(highEfficiency.co2).toBeLessThan(lowEfficiency.co2);
    });
  });
});
