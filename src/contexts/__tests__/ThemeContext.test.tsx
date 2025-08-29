import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  test('provides initial theme state', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.themeName).toBe('blackWhite');
    expect(result.current.currentTheme).toBeDefined();
    expect(result.current.availableThemes).toBeDefined();
    expect(result.current.availableThemes.length).toBeGreaterThan(0);
  });

  test('changes theme correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('blue');
    });

    expect(result.current.themeName).toBe('blue');
  });

  test('persists theme in localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    act(() => {
      result.current.setTheme('green');
    });

    const storedTheme = localStorage.getItem('fuel-economy-theme');
    expect(storedTheme).toBe('green');
  });

  test('loads theme from localStorage on initialization', () => {
    localStorage.setItem('fuel-economy-theme', 'blue');

    const { result } = renderHook(() => useTheme(), { wrapper });
    
    expect(result.current.themeName).toBe('blue');

    // Cleanup
    localStorage.removeItem('fuel-economy-theme');
  });

  test('has all required theme properties', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    const currentTheme = result.current.currentTheme;
    expect(currentTheme.colors.primary).toBeDefined();
    expect(currentTheme.colors.surface).toBeDefined();
    expect(currentTheme.colors.background).toBeDefined();
    expect(currentTheme.colors.text).toBeDefined();
  });

  test('theme switching updates theme object', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    const initialTheme = result.current.currentTheme.name;
    
    act(() => {
      result.current.setTheme('green');
    });

    expect(result.current.currentTheme.name).not.toBe(initialTheme);
    expect(result.current.themeName).toBe('green');
  });

  test('ignores invalid theme names', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    const initialTheme = result.current.themeName;
    
    act(() => {
      result.current.setTheme('invalidTheme');
    });

    expect(result.current.themeName).toBe(initialTheme);
  });
});
