import { useAppDispatch, useAppSelector } from '../redux';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Redux Hooks', () => {
  test('useAppDispatch returns dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    
    expect(typeof result.current).toBe('function');
  });

  test('useAppSelector returns state value', () => {
    const { result } = renderHook(
      () => useAppSelector((state) => state.favorites.items),
      { wrapper }
    );
    
    expect(Array.isArray(result.current)).toBe(true);
  });

  test('useAppSelector with filters state', () => {
    const { result } = renderHook(
      () => useAppSelector((state) => state.filters),
      { wrapper }
    );
    
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });
});
