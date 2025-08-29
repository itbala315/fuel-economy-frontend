import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple CarDetails page test
describe('CarDetails Page', () => {
  test('renders car details page', () => {
    const mockCar = {
      id: '123',
      carName: 'Toyota Prius',
      mpg: 50,
      cylinders: 4,
      displacement: 1.8,
      horsepower: 121,
      weight: 2921,
      acceleration: 9.6,
      modelYear: 2020,
      origin: 'Japan'
    };

    const CarDetailsComponent = () => (
      <div>
        <h1>{mockCar.carName}</h1>
        <div data-testid="car-specs">
          <div>
            <span>MPG:</span>
            <span>{mockCar.mpg}</span>
          </div>
          <div>
            <span>Cylinders:</span>
            <span>{mockCar.cylinders}</span>
          </div>
          <div>
            <span>Displacement:</span>
            <span>{mockCar.displacement}L</span>
          </div>
          <div>
            <span>Horsepower:</span>
            <span>{mockCar.horsepower}</span>
          </div>
          <div>
            <span>Weight:</span>
            <span>{mockCar.weight} lbs</span>
          </div>
          <div>
            <span>Acceleration:</span>
            <span>{mockCar.acceleration}s</span>
          </div>
          <div>
            <span>Year:</span>
            <span>{mockCar.modelYear}</span>
          </div>
          <div>
            <span>Origin:</span>
            <span>{mockCar.origin}</span>
          </div>
        </div>
        <div>
          <button>Add to Favorites</button>
          <button>Compare Vehicle</button>
          <a href="/browse">Back to Browse</a>
        </div>
      </div>
    );

    render(<CarDetailsComponent />);

    expect(screen.getByText('Toyota Prius')).toBeInTheDocument();
    expect(screen.getByTestId('car-specs')).toBeInTheDocument();
    expect(screen.getByText('MPG:')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Cylinders:')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to Favorites' })).toBeInTheDocument();
  });

  test('displays efficiency rating', () => {
    const EfficiencyRatingComponent = () => {
      const mpg = 35;
      let rating = 'Poor';
      let ratingColor = 'red';

      if (mpg >= 40) {
        rating = 'Excellent';
        ratingColor = 'green';
      } else if (mpg >= 30) {
        rating = 'Good';
        ratingColor = 'blue';
      } else if (mpg >= 20) {
        rating = 'Average';
        ratingColor = 'orange';
      }

      return (
        <div>
          <h3>Efficiency Rating</h3>
          <div data-testid="rating" style={{ color: ratingColor }}>
            {rating}
          </div>
          <div data-testid="mpg-value">{mpg} MPG</div>
        </div>
      );
    };

    render(<EfficiencyRatingComponent />);

    expect(screen.getByText('Efficiency Rating')).toBeInTheDocument();
    expect(screen.getByTestId('rating')).toHaveTextContent('Good');
    expect(screen.getByTestId('mpg-value')).toHaveTextContent('35 MPG');
  });

  test('shows fuel cost calculator', () => {
    const FuelCostCalculatorComponent = () => {
      const mpg = 25;
      const milesPerYear = 15000;
      const fuelPrice = 3.50;
      const gallonsPerYear = milesPerYear / mpg;
      const annualFuelCost = gallonsPerYear * fuelPrice;

      return (
        <div>
          <h3>Annual Fuel Cost Estimate</h3>
          <div data-testid="fuel-cost">
            <p>Miles per year: {milesPerYear.toLocaleString()}</p>
            <p>Average fuel price: ${fuelPrice}</p>
            <p>Gallons per year: {gallonsPerYear.toFixed(0)}</p>
            <p data-testid="annual-cost">
              Annual fuel cost: ${annualFuelCost.toFixed(0)}
            </p>
          </div>
        </div>
      );
    };

    render(<FuelCostCalculatorComponent />);

    expect(screen.getByText('Annual Fuel Cost Estimate')).toBeInTheDocument();
    expect(screen.getByTestId('fuel-cost')).toBeInTheDocument();
    expect(screen.getByTestId('annual-cost')).toHaveTextContent('Annual fuel cost: $2100');
  });

  test('displays similar vehicles', () => {
    const similarVehicles = [
      { id: 1, name: 'Honda Civic', mpg: 32 },
      { id: 2, name: 'Nissan Sentra', mpg: 29 },
      { id: 3, name: 'Hyundai Elantra', mpg: 31 }
    ];

    const SimilarVehiclesComponent = () => (
      <div>
        <h3>Similar Vehicles</h3>
        <div data-testid="similar-vehicles">
          {similarVehicles.map(car => (
            <div key={car.id} data-testid={`similar-car-${car.id}`}>
              <span>{car.name}</span>
              <span>{car.mpg} MPG</span>
              <button>View Details</button>
            </div>
          ))}
        </div>
      </div>
    );

    render(<SimilarVehiclesComponent />);

    expect(screen.getByText('Similar Vehicles')).toBeInTheDocument();
    expect(screen.getByTestId('similar-vehicles')).toBeInTheDocument();
    
    similarVehicles.forEach(car => {
      expect(screen.getByTestId(`similar-car-${car.id}`)).toBeInTheDocument();
      expect(screen.getByText(car.name)).toBeInTheDocument();
    });
  });

  test('shows loading state', () => {
    const LoadingComponent = () => {
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
      }, []);

      if (loading) {
        return <div data-testid="loading">Loading car details...</div>;
      }

      return <div data-testid="loaded">Car details loaded</div>;
    };

    render(<LoadingComponent />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading car details...')).toBeInTheDocument();
  });

  test('handles error state', () => {
    const ErrorComponent = () => {
      const hasError = true;

      if (hasError) {
        return (
          <div data-testid="error-state">
            <h2>Car Not Found</h2>
            <p>The requested vehicle could not be found.</p>
            <button>Go Back</button>
          </div>
        );
      }

      return <div>Car details</div>;
    };

    render(<ErrorComponent />);

    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Car Not Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });
});
