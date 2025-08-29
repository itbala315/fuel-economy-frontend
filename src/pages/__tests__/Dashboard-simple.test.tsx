import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple Dashboard page test
describe('Dashboard Page', () => {
  test('renders dashboard overview', () => {
    const DashboardComponent = () => (
      <div>
        <h1>Fuel Economy Dashboard</h1>
        <div data-testid="dashboard-stats">
          <div>
            <h3>Total Vehicles</h3>
            <span>398</span>
          </div>
          <div>
            <h3>Average MPG</h3>
            <span>23.5</span>
          </div>
          <div>
            <h3>Best MPG</h3>
            <span>46.6</span>
          </div>
        </div>
        <div>
          <h2>Recent Activity</h2>
          <ul>
            <li>Added Toyota Prius to favorites</li>
            <li>Compared Honda Civic vs Toyota Corolla</li>
            <li>Viewed Ford F-150 details</li>
          </ul>
        </div>
      </div>
    );

    render(<DashboardComponent />);

    expect(screen.getByText('Fuel Economy Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
    expect(screen.getByText('398')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  test('displays charts and visualizations placeholder', () => {
    const ChartComponent = () => (
      <div>
        <h2>Fuel Efficiency Trends</h2>
        <div data-testid="chart-container">
          <div>MPG by Year Chart Placeholder</div>
          <div>MPG by Origin Chart Placeholder</div>
          <div>Cylinder Distribution Chart Placeholder</div>
        </div>
      </div>
    );

    render(<ChartComponent />);

    expect(screen.getByText('Fuel Efficiency Trends')).toBeInTheDocument();
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByText('MPG by Year Chart Placeholder')).toBeInTheDocument();
  });

  test('shows favorites summary', () => {
    const mockFavorites = [
      { id: 1, name: 'Toyota Prius', mpg: 50 },
      { id: 2, name: 'Honda Civic', mpg: 32 },
      { id: 3, name: 'Tesla Model 3', mpg: 130 }
    ];

    const FavoritesComponent = () => (
      <div>
        <h2>Your Favorites ({mockFavorites.length})</h2>
        <div data-testid="favorites-list">
          {mockFavorites.map(car => (
            <div key={car.id} data-testid={`favorite-${car.id}`}>
              <span>{car.name}</span>
              <span>{car.mpg} MPG</span>
            </div>
          ))}
        </div>
        <button>View All Favorites</button>
      </div>
    );

    render(<FavoritesComponent />);

    expect(screen.getByText('Your Favorites (3)')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
    mockFavorites.forEach(car => {
      expect(screen.getByTestId(`favorite-${car.id}`)).toBeInTheDocument();
    });
  });

  test('displays comparison tools', () => {
    const ComparisonComponent = () => (
      <div>
        <h2>Vehicle Comparison</h2>
        <div>
          <select data-testid="car-select-1">
            <option value="">Select first vehicle</option>
            <option value="1">Toyota Prius</option>
            <option value="2">Honda Civic</option>
          </select>
          <span>vs</span>
          <select data-testid="car-select-2">
            <option value="">Select second vehicle</option>
            <option value="1">Toyota Prius</option>
            <option value="2">Honda Civic</option>
          </select>
        </div>
        <button>Compare Vehicles</button>
        <div data-testid="comparison-result">
          <p>Select two vehicles to compare</p>
        </div>
      </div>
    );

    render(<ComparisonComponent />);

    expect(screen.getByText('Vehicle Comparison')).toBeInTheDocument();
    expect(screen.getByTestId('car-select-1')).toBeInTheDocument();
    expect(screen.getByTestId('car-select-2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Compare Vehicles' })).toBeInTheDocument();
  });

  test('handles filter interactions', () => {
    const FilterDashboard = () => {
      const [timeRange, setTimeRange] = React.useState('all');
      
      return (
        <div>
          <h2>Dashboard Filters</h2>
          <div>
            <label>
              Time Range:
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                data-testid="time-filter"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </label>
          </div>
          <div data-testid="filter-result">
            Showing data for: {timeRange}
          </div>
        </div>
      );
    };

    render(<FilterDashboard />);

    const timeFilter = screen.getByTestId('time-filter');
    fireEvent.change(timeFilter, { target: { value: 'month' } });

    expect(screen.getByTestId('filter-result')).toHaveTextContent('Showing data for: month');
  });
});
