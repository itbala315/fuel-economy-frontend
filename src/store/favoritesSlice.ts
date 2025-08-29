import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteItem, Car } from '../types';

interface FavoritesState {
  items: FavoriteItem[];
}

const loadFavoritesFromStorage = (): FavoriteItem[] => {
  try {
    const saved = localStorage.getItem('fuel-economy-favorites');
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    // Validate the data structure
    if (!Array.isArray(parsed)) return [];
    
    // Filter out any invalid favorites
    const validFavorites = parsed.filter((item: any) => 
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.year === 'number' &&
      typeof item.mpg === 'number' &&
      typeof item.addedAt === 'number'
    );
    
    return validFavorites;
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: FavoriteItem[]) => {
  try {
    localStorage.setItem('fuel-economy-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

const initialState: FavoritesState = {
  items: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Omit<FavoriteItem, 'id'>>) => {
      const newFavorite: FavoriteItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.items.push(newFavorite);
      saveFavoritesToStorage(state.items);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      saveFavoritesToStorage([]);
    },
    toggleFavorite: (state, action: PayloadAction<Car>) => {
      const car = action.payload;
      
      // Validate car data
      if (!car || !car.id || !car.carName || !car.modelYear || typeof car.mpg !== 'number') {
        console.error('Invalid car data for favorite toggle:', car);
        return;
      }
      
      const existingIndex = state.items.findIndex(
        item => item.id === car.id.toString()
      );
      
      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        const newFavorite: FavoriteItem = {
          id: car.id.toString(),
          name: car.carName,
          year: car.modelYear,
          mpg: car.mpg,
          addedAt: Date.now(),
        };
        state.items.push(newFavorite);
      }
      saveFavoritesToStorage(state.items);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites, toggleFavorite } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;

// Helper function to check if a car is favorited
export const selectIsFavorite = (state: { favorites: FavoritesState }, carId: string | number) => {
  return state.favorites.items.some(item => item.id === carId.toString());
};

export default favoritesSlice.reducer;
