import { configureStore } from '@reduxjs/toolkit';
import { carsApi } from '../services/api';
import filtersReducer from './filtersSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    [carsApi.reducerPath]: carsApi.reducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(carsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
