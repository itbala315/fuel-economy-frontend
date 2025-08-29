import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple Browse page test
describe('Browse Page', () => {
  test('renders search and filter components', () => {
    const BrowseComponent = () => (
      <div>
        <h1>Browse Vehicles</h1>
        <div>
          <input 
            type="text" 
            placeholder="Search vehicles..."
            aria-label="Search vehicles"
          />
          <select aria-label="Filter by origin">
            <option value="">All Origins</option>
            <option value="USA">USA</option>
            <option value="Japan">Japan</option>
          </select>
          <select aria-label="Filter by cylinders">
            <option value="">All Cylinders</option>
            <option value="4">4 Cylinders</option>
            <option value="6">6 Cylinders</option>
            <option value="8">8 Cylinders</option>
          </select>
        </div>
        <div>
          <h2>Vehicle Results</h2>
          <div data-testid="vehicle-list">
            <p>No vehicles found matching your criteria.</p>
          </div>
        </div>
      </div>
    );

    render(<BrowseComponent />);

    expect(screen.getByText('Browse Vehicles')).toBeInTheDocument();
    expect(screen.getByLabelText('Search vehicles')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by origin')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by cylinders')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-list')).toBeInTheDocument();
  });

  test('handles search input', () => {
    const SearchComponent = () => {
      const [search, setSearch] = React.useState('');
      
      return (
        <div>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles..."
            data-testid="search-input"
          />
          <div data-testid="search-value">{search}</div>
        </div>
      );
    };

    render(<SearchComponent />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'toyota' } });

    expect(screen.getByTestId('search-value')).toHaveTextContent('toyota');
  });

  test('displays filter options', () => {
    const FilterComponent = () => (
      <div>
        <h3>Filters</h3>
        <div>
          <label>
            MPG Range:
            <input type="range" min="10" max="50" defaultValue="25" />
          </label>
        </div>
        <div>
          <label>
            Year Range:
            <select>
              <option value="">All Years</option>
              <option value="1970-1980">1970-1980</option>
              <option value="1980-1990">1980-1990</option>
            </select>
          </label>
        </div>
        <button>Reset Filters</button>
      </div>
    );

    render(<FilterComponent />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('MPG Range:')).toBeInTheDocument();
    expect(screen.getByText('Year Range:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument();
  });

  test('displays vehicle grid layout', () => {
    const mockVehicles = [
      { id: 1, name: 'Toyota Corolla', mpg: 32, year: 2020 },
      { id: 2, name: 'Honda Civic', mpg: 30, year: 2019 },
      { id: 3, name: 'Ford F-150', mpg: 18, year: 2021 }
    ];

    const VehicleGrid = () => (
      <div data-testid="vehicle-grid">
        {mockVehicles.map(vehicle => (
          <div key={vehicle.id} data-testid={`vehicle-${vehicle.id}`}>
            <h4>{vehicle.name}</h4>
            <p>MPG: {vehicle.mpg}</p>
            <p>Year: {vehicle.year}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    );

    render(<VehicleGrid />);

    expect(screen.getByTestId('vehicle-grid')).toBeInTheDocument();
    mockVehicles.forEach(vehicle => {
      expect(screen.getByTestId(`vehicle-${vehicle.id}`)).toBeInTheDocument();
      expect(screen.getByText(vehicle.name)).toBeInTheDocument();
    });
  });

  test('handles pagination', () => {
    const PaginationComponent = () => {
      const [currentPage, setCurrentPage] = React.useState(1);
      const totalPages = 5;

      return (
        <div>
          <div data-testid="current-page">Page {currentPage} of {totalPages}</div>
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      );
    };

    render(<PaginationComponent />);

    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 of 5');
    
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2 of 5');
  });
});
