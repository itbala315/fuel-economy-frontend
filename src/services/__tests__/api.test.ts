import { carsApi } from '../api';

// Mock the API responses for testing
const mockCarsResponse = {
  data: [
    {
      id: 1,
      mpg: 18.0,
      cylinders: 8,
      displacement: 307.0,
      horsepower: 130.0,
      weight: 3504.0,
      acceleration: 12.0,
      modelYear: 1970,
      origin: 1,
      carName: "chevrolet chevelle malibu",
      originName: "USA"
    }
  ],
  statistics: {
    totalCars: 1,
    avgMpg: "18.0",
    mpgRange: { min: 18.0, max: 18.0 },
    yearRange: { min: 1970, max: 1970 },
    uniqueOrigins: 1
  }
};

describe('Cars API', () => {
  test('should have correct endpoint configuration', () => {
    expect(carsApi.reducerPath).toBe('carsApi');
  });

  test('should have getCars endpoint', () => {
    expect(carsApi.endpoints.getCars).toBeDefined();
  });

  test('should have getStatistics endpoint', () => {
    expect(carsApi.endpoints.getStatistics).toBeDefined();
  });

  test('should have correct API endpoint structure', () => {
    const endpoint = carsApi.endpoints.getCars;
    expect(endpoint).toBeDefined();
    expect(typeof endpoint).toBe('object');
  });

  test('should have statistics endpoint defined', () => {
    const endpoint = carsApi.endpoints.getStatistics;
    expect(endpoint).toBeDefined();
    expect(typeof endpoint).toBe('object');
  });
});
