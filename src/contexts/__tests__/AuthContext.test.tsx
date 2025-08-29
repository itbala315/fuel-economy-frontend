import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  test('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('login function works correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      loginTime: new Date().toISOString()
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  test('logout function works correctly', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      loginTime: new Date().toISOString()
    };

    // First login
    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('persists user data in localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      loginTime: new Date().toISOString()
    };

    act(() => {
      result.current.login(mockUser);
    });

    const storedUser = localStorage.getItem('fuel-economy-user');
    expect(JSON.parse(storedUser!)).toEqual(mockUser);
  });

  test('loads user from localStorage on initialization', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('fuel-economy-user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);

    // Cleanup
    localStorage.removeItem('fuel-economy-user');
  });
});
