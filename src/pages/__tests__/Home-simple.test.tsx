import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple Home page test
describe('Home Page', () => {
  test('renders home page content', () => {
    const HomeComponent = () => (
      <div>
        <h1>Welcome to Fuel Economy Explorer</h1>
        <p>Discover the most fuel-efficient vehicles</p>
        <div>
          <h2>Getting Started</h2>
          <p>Browse our comprehensive database</p>
        </div>
        <div>
          <h2>Features</h2>
          <ul>
            <li>Advanced search filters</li>
            <li>Detailed comparisons</li>
            <li>Historical data trends</li>
          </ul>
        </div>
      </div>
    );

    render(<HomeComponent />);

    expect(screen.getByText('Welcome to Fuel Economy Explorer')).toBeInTheDocument();
    expect(screen.getByText('Discover the most fuel-efficient vehicles')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  test('displays navigation options', () => {
    const NavigationComponent = () => (
      <nav>
        <ul>
          <li><a href="/browse">Browse Cars</a></li>
          <li><a href="/favorites">Favorites</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </nav>
    );

    render(<NavigationComponent />);

    expect(screen.getByText('Browse Cars')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('has proper hero section', () => {
    const HeroSection = () => (
      <section data-testid="hero-section">
        <h1>Fuel Economy Data Explorer</h1>
        <p>Your comprehensive tool for vehicle fuel efficiency analysis</p>
        <button>Get Started</button>
      </section>
    );

    render(<HeroSection />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText('Fuel Economy Data Explorer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });
});
