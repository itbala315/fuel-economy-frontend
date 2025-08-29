import favoritesReducer, {
  addFavorite,
  removeFavorite,
  clearFavorites,
  toggleFavorite
} from '../favoritesSlice';
import { FavoriteItem } from '../../types';

interface FavoritesState {
  items: FavoriteItem[];
}

describe('favoritesSlice', () => {
  const initialState: FavoritesState = {
    items: []
  };

  const mockFavoriteItem = {
    name: "chevrolet chevelle malibu",
    year: 1970,
    mpg: 18.0,
    addedAt: Date.now()
  };

  const mockCar = {
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
  };

  test('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(
      expect.objectContaining({
        items: expect.any(Array)
      })
    );
  });

  test('should handle addFavorite', () => {
    const actual = favoritesReducer(initialState, addFavorite(mockFavoriteItem));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toMatchObject({
      name: mockFavoriteItem.name,
      year: mockFavoriteItem.year,
      mpg: mockFavoriteItem.mpg,
      addedAt: mockFavoriteItem.addedAt
    });
  });

  test('should handle removeFavorite', () => {
    const stateWithFavorite: FavoritesState = {
      items: [{ ...mockFavoriteItem, id: 'test-id' }]
    };
    
    const actual = favoritesReducer(stateWithFavorite, removeFavorite('test-id'));
    expect(actual.items).toHaveLength(0);
  });

  test('should handle clearFavorites', () => {
    const stateWithFavorites: FavoritesState = {
      items: [
        { ...mockFavoriteItem, id: '1' },
        { ...mockFavoriteItem, id: '2' }
      ]
    };
    
    const actual = favoritesReducer(stateWithFavorites, clearFavorites());
    expect(actual.items).toHaveLength(0);
  });

  test('should handle toggleFavorite - add new favorite', () => {
    const actual = favoritesReducer(initialState, toggleFavorite(mockCar));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toMatchObject({
      id: '1',
      name: mockCar.carName,
      year: mockCar.modelYear,
      mpg: mockCar.mpg
    });
  });

  test('should handle toggleFavorite - remove existing favorite', () => {
    const stateWithFavorite: FavoritesState = {
      items: [{
        id: '1',
        name: mockCar.carName,
        year: mockCar.modelYear,
        mpg: mockCar.mpg,
        addedAt: Date.now()
      }]
    };
    
    const actual = favoritesReducer(stateWithFavorite, toggleFavorite(mockCar));
    expect(actual.items).toHaveLength(0);
  });

  test('should handle adding multiple different favorites', () => {
    const secondFavorite = {
      name: "buick skylark 320",
      year: 1970,
      mpg: 15.0,
      addedAt: Date.now()
    };
    
    let state = favoritesReducer(initialState, addFavorite(mockFavoriteItem));
    state = favoritesReducer(state, addFavorite(secondFavorite));
    
    expect(state.items).toHaveLength(2);
    expect(state.items[0].name).toBe(mockFavoriteItem.name);
    expect(state.items[1].name).toBe(secondFavorite.name);
  });
});
