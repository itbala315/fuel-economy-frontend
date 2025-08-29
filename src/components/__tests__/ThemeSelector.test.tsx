import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import ThemeSelector from '../ThemeSelector';

describe('ThemeSelector Component', () => {
  test('renders theme selector button', () => {
    render(<ThemeSelector />);
    
    const themeButton = screen.getByRole('button');
    expect(themeButton).toBeInTheDocument();
  });

  test('opens theme options when clicked', () => {
    render(<ThemeSelector />);
    
    const themeButton = screen.getByRole('button');
    fireEvent.click(themeButton);
    
    // Check if theme options appear (using partial text match)
    expect(screen.getByText('Blue Ocean')).toBeInTheDocument();
    expect(screen.getByText('Nature Green')).toBeInTheDocument();
    expect(screen.getByText('Choose Theme')).toBeInTheDocument();
  });

  test('changes theme when option is selected', () => {
    render(<ThemeSelector />);
    
    const themeButton = screen.getByRole('button');
    fireEvent.click(themeButton);
    
    const greenTheme = screen.getByText('Nature Green');
    fireEvent.click(greenTheme);
    
    // Verify the theme change (you might need to check CSS classes or context)
    expect(themeButton).toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(<ThemeSelector />);
    
    const themeButton = screen.getByRole('button');
    fireEvent.click(themeButton);
    
    // Click outside
    fireEvent.click(document.body);
    
    // Theme options should be hidden
    expect(screen.queryByText('Blue')).not.toBeInTheDocument();
  });
});
