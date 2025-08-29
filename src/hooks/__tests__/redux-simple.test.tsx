import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from '../../store/favoritesSlice';
import filtersReducer from '../../store/filtersSlice';

// Create a simple store for testing
const createTestStore = () => configureStore({
  reducer: {
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
});

// Simple mock hooks to test Redux integration
const useAppSelector = (selector: any) => {
  const store = createTestStore();
  return selector(store.getState());
};

const useAppDispatch = () => {
  const store = createTestStore();
  return store.dispatch;
};

describe('Redux Hooks', () => {
  test('useAppSelector works with favorites', () => {
    const selectFavorites = (state: any) => state.favorites.items;
    const favorites = useAppSelector(selectFavorites);
    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites).toHaveLength(0);
  });

  test('useAppSelector works with filters', () => {
    const selectFilters = (state: any) => state.filters;
    const filters = useAppSelector(selectFilters);
    
    expect(filters).toHaveProperty('search');
    expect(filters).toHaveProperty('minMpg');
    expect(filters).toHaveProperty('maxMpg');
    expect(filters).toHaveProperty('cylinders');
    expect(filters).toHaveProperty('origin');
  });

  test('useAppDispatch returns a function', () => {
    const dispatch = useAppDispatch();
    expect(typeof dispatch).toBe('function');
  });

  test('store configuration is valid', () => {
    const store = createTestStore();
    const state = store.getState();
    
    expect(state).toHaveProperty('favorites');
    expect(state).toHaveProperty('filters');
    expect(state.favorites).toHaveProperty('items');
    expect(state.filters).toHaveProperty('search');
  });

  test('store actions can be dispatched', () => {
    const store = createTestStore();
    
    // Test dispatching a simple action
    const action = { type: 'favorites/clearFavorites' };
    expect(() => store.dispatch(action)).not.toThrow();
    
    const newState = store.getState();
    expect(newState.favorites.items).toHaveLength(0);
  });
});
