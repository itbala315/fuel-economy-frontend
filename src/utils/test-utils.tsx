import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Simple router mock that just renders children
const MockRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="mock-router">{children}</div>
);

// Mock data for testing
export const mockCarData = {
  mpg: 18.0,
  cylinders: 8,
  displacement: 307.0,
  horsepower: 130.0,
  weight: 3504.0,
  acceleration: 12.0,
  modelYear: 1970,
  origin: 1,
  carName: "chevrolet chevelle malibu"
};

export const mockCarsData = {
  data: [
    mockCarData,
    {
      mpg: 15.0,
      cylinders: 8,
      displacement: 350.0,
      horsepower: 165.0,
      weight: 3693.0,
      acceleration: 11.5,
      modelYear: 1970,
      origin: 1,
      carName: "buick skylark 320"
    },
    {
      mpg: 18.0,
      cylinders: 8,
      displacement: 318.0,
      horsepower: 150.0,
      weight: 3436.0,
      acceleration: 11.0,
      modelYear: 1970,
      origin: 1,
      carName: "plymouth satellite"
    }
  ]
};

// Custom render function that includes all providers
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <Provider store={store}>
      <MockRouter>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </MockRouter>
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
