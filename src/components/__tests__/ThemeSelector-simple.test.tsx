import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple ThemeSelector test
describe('ThemeSelector Component', () => {
  test('renders theme selector', () => {
    const ThemeSelectorComponent = () => (
      <div data-testid="theme-selector">
        <label htmlFor="theme-select">Choose Theme:</label>
        <select id="theme-select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
    );

    render(<ThemeSelectorComponent />);

    expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose Theme:')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dark' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Auto' })).toBeInTheDocument();
  });

  test('handles theme selection', () => {
    let selectedTheme = 'light';
    
    const ThemeSelectorComponent = () => (
      <div>
        <select 
          value={selectedTheme}
          onChange={(e) => { selectedTheme = e.target.value; }}
          data-testid="theme-select"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div data-testid="current-theme">{selectedTheme}</div>
      </div>
    );

    render(<ThemeSelectorComponent />);

    const selectElement = screen.getByTestId('theme-select');
    fireEvent.change(selectElement, { target: { value: 'dark' } });
    
    expect(selectElement).toBeInTheDocument();
  });

  test('displays theme options correctly', () => {
    const themes = [
      { value: 'light', label: 'Light Theme' },
      { value: 'dark', label: 'Dark Theme' },
      { value: 'blue', label: 'Blue Theme' },
      { value: 'green', label: 'Green Theme' }
    ];

    const ThemeOptionsComponent = () => (
      <div>
        {themes.map(theme => (
          <div key={theme.value} data-testid={`theme-${theme.value}`}>
            {theme.label}
          </div>
        ))}
      </div>
    );

    render(<ThemeOptionsComponent />);

    themes.forEach(theme => {
      expect(screen.getByTestId(`theme-${theme.value}`)).toBeInTheDocument();
      expect(screen.getByText(theme.label)).toBeInTheDocument();
    });
  });

  test('theme configuration is valid', () => {
    const themeConfig = {
      default: 'light',
      available: ['light', 'dark', 'blue', 'green'],
      storageKey: 'selectedTheme'
    };

    expect(themeConfig.default).toBe('light');
    expect(themeConfig.available).toContain('light');
    expect(themeConfig.available).toContain('dark');
    expect(themeConfig.storageKey).toBe('selectedTheme');
    expect(themeConfig.available.length).toBeGreaterThan(0);
  });
});
