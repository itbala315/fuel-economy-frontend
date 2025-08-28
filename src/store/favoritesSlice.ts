import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteItem, Car } from '../types';

interface FavoritesState {
  items: FavoriteItem[];
}

const loadFavoritesFromStorage = (): FavoriteItem[] => {
  try {
    const saved = localStorage.getItem('fuel-economy-favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
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

export default favoritesSlice.reducer;
