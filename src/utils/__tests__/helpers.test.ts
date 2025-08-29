import {
  formatMpg,
  formatYear,
  getOriginName,
  calculateRange,
  isValidMpg,
  sortCarsByMpg,
  filterCarsByYear
} from '../helpers';

describe('Utility Functions', () => {
  describe('formatMpg', () => {
    test('formats MPG with one decimal place', () => {
      expect(formatMpg(25.6)).toBe('25.6 MPG');
      expect(formatMpg(18)).toBe('18.0 MPG');
      expect(formatMpg(30.89)).toBe('30.9 MPG');
    });
  });

  describe('formatYear', () => {
    test('converts year to string', () => {
      expect(formatYear(1970)).toBe('1970');
      expect(formatYear(1982)).toBe('1982');
    });
  });

  describe('getOriginName', () => {
    test('returns correct origin names', () => {
      expect(getOriginName(1)).toBe('USA');
      expect(getOriginName(2)).toBe('Europe');
      expect(getOriginName(3)).toBe('Japan');
      expect(getOriginName(4)).toBe('Unknown');
      expect(getOriginName(0)).toBe('Unknown');
    });
  });

  describe('calculateRange', () => {
    test('calculates min and max from array', () => {
      expect(calculateRange([1, 5, 3, 9, 2])).toEqual({ min: 1, max: 9 });
      expect(calculateRange([10])).toEqual({ min: 10, max: 10 });
      expect(calculateRange([])).toEqual({ min: 0, max: 0 });
    });
  });

  describe('isValidMpg', () => {
    test('validates MPG values', () => {
      expect(isValidMpg(25)).toBe(true);
      expect(isValidMpg(0.1)).toBe(true);
      expect(isValidMpg(100)).toBe(true);
      expect(isValidMpg(0)).toBe(false);
      expect(isValidMpg(-5)).toBe(false);
      expect(isValidMpg(101)).toBe(false);
    });
  });

  describe('sortCarsByMpg', () => {
    const cars = [
      { mpg: 20, name: 'Car A' },
      { mpg: 15, name: 'Car B' },
      { mpg: 25, name: 'Car C' }
    ];

    test('sorts cars by MPG ascending', () => {
      const sorted = sortCarsByMpg(cars, true);
      expect(sorted[0].mpg).toBe(15);
      expect(sorted[1].mpg).toBe(20);
      expect(sorted[2].mpg).toBe(25);
    });

    test('sorts cars by MPG descending', () => {
      const sorted = sortCarsByMpg(cars, false);
      expect(sorted[0].mpg).toBe(25);
      expect(sorted[1].mpg).toBe(20);
      expect(sorted[2].mpg).toBe(15);
    });

    test('does not mutate original array', () => {
      const original = [...cars];
      sortCarsByMpg(cars, true);
      expect(cars).toEqual(original);
    });
  });

  describe('filterCarsByYear', () => {
    const cars = [
      { modelYear: 1970, name: 'Car A' },
      { modelYear: 1975, name: 'Car B' },
      { modelYear: 1980, name: 'Car C' },
      { modelYear: 1985, name: 'Car D' }
    ];

    test('filters cars within year range', () => {
      const filtered = filterCarsByYear(cars, 1973, 1979);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].modelYear).toBe(1975);
    });

    test('includes boundary years', () => {
      const filtered = filterCarsByYear(cars, 1970, 1980);
      expect(filtered).toHaveLength(3);
      expect(filtered.map(car => car.modelYear)).toEqual([1970, 1975, 1980]);
    });

    test('returns empty array when no cars match', () => {
      const filtered = filterCarsByYear(cars, 1990, 1995);
      expect(filtered).toHaveLength(0);
    });
  });
});
