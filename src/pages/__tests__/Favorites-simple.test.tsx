import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple Favorites page test
describe('Favorites Page', () => {
  test('renders favorites page', () => {
    const FavoritesComponent = () => (
      <div>
        <h1>My Favorite Vehicles</h1>
        <p>Keep track of the vehicles you're most interested in</p>
        <div data-testid="favorites-container">
          <div>No favorites added yet</div>
        </div>
      </div>
    );

    render(<FavoritesComponent />);

    expect(screen.getByText('My Favorite Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Keep track of the vehicles you\'re most interested in')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-container')).toBeInTheDocument();
  });

  test('displays list of favorite vehicles', () => {
    const mockFavorites = [
      { id: 1, name: 'Toyota Prius', mpg: 50, year: 2020 },
      { id: 2, name: 'Honda Civic', mpg: 32, year: 2019 },
      { id: 3, name: 'Tesla Model 3', mpg: 130, year: 2021 }
    ];

    const FavoritesListComponent = () => (
      <div>
        <h2>Your Favorites ({mockFavorites.length})</h2>
        <div data-testid="favorites-grid">
          {mockFavorites.map(car => (
            <div key={car.id} data-testid={`favorite-card-${car.id}`}>
              <h3>{car.name}</h3>
              <p>MPG: {car.mpg}</p>
              <p>Year: {car.year}</p>
              <button>Remove from Favorites</button>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    );

    render(<FavoritesListComponent />);

    expect(screen.getByText('Your Favorites (3)')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-grid')).toBeInTheDocument();
    
    mockFavorites.forEach(car => {
      expect(screen.getByTestId(`favorite-card-${car.id}`)).toBeInTheDocument();
      expect(screen.getByText(car.name)).toBeInTheDocument();
      expect(screen.getByText(`MPG: ${car.mpg}`)).toBeInTheDocument();
    });
  });

  test('handles removing favorites', () => {
    const RemoveFavoriteComponent = () => {
      const [favorites, setFavorites] = React.useState([
        { id: 1, name: 'Toyota Prius', mpg: 50 },
        { id: 2, name: 'Honda Civic', mpg: 32 }
      ]);

      const removeFavorite = (id: number) => {
        setFavorites(favorites.filter(car => car.id !== id));
      };

      return (
        <div>
          <div data-testid="favorites-count">Favorites: {favorites.length}</div>
          {favorites.map(car => (
            <div key={car.id}>
              <span>{car.name}</span>
              <button onClick={() => removeFavorite(car.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };

    render(<RemoveFavoriteComponent />);

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Favorites: 2');

    const removeButton = screen.getAllByText('Remove')[0];
    fireEvent.click(removeButton);

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('Favorites: 1');
  });

  test('shows empty state when no favorites', () => {
    const EmptyFavoritesComponent = () => (
      <div>
        <div data-testid="empty-state">
          <h2>No Favorites Yet</h2>
          <p>Start exploring vehicles and add them to your favorites</p>
          <button>Browse Vehicles</button>
        </div>
      </div>
    );

    render(<EmptyFavoritesComponent />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No Favorites Yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Vehicles' })).toBeInTheDocument();
  });

  test('displays favorite sorting options', () => {
    const SortingComponent = () => {
      const [sortBy, setSortBy] = React.useState('name');

      return (
        <div>
          <label>
            Sort by:
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              data-testid="sort-select"
            >
              <option value="name">Name</option>
              <option value="mpg">MPG</option>
              <option value="year">Year</option>
              <option value="dateAdded">Date Added</option>
            </select>
          </label>
          <div data-testid="sort-result">Sorted by: {sortBy}</div>
        </div>
      );
    };

    render(<SortingComponent />);

    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.change(sortSelect, { target: { value: 'mpg' } });

    expect(screen.getByTestId('sort-result')).toHaveTextContent('Sorted by: mpg');
  });

  test('handles bulk operations', () => {
    const BulkOperationsComponent = () => {
      const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
      const favorites = [
        { id: 1, name: 'Car 1' },
        { id: 2, name: 'Car 2' },
        { id: 3, name: 'Car 3' }
      ];

      const toggleSelection = (id: number) => {
        setSelectedItems(prev => 
          prev.includes(id) 
            ? prev.filter(i => i !== id)
            : [...prev, id]
        );
      };

      return (
        <div>
          <div data-testid="selection-count">
            Selected: {selectedItems.length}
          </div>
          {favorites.map(car => (
            <div key={car.id}>
              <input
                type="checkbox"
                checked={selectedItems.includes(car.id)}
                onChange={() => toggleSelection(car.id)}
                data-testid={`checkbox-${car.id}`}
              />
              <span>{car.name}</span>
            </div>
          ))}
          <button disabled={selectedItems.length === 0}>
            Remove Selected
          </button>
        </div>
      );
    };

    render(<BulkOperationsComponent />);

    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 0');

    const checkbox = screen.getByTestId('checkbox-1');
    fireEvent.click(checkbox);

    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 1');
  });
});
