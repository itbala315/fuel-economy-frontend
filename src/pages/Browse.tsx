import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Fuel, 
  Calendar, 
  Settings,
  Heart,
  Eye,
  ChevronDown,
  ChevronRight,
  Gauge,
  Globe,
  Zap,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useGetCarsQuery } from '../services/api';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { 
  setSearch, 
  setYearRange, 
  setSorting, 
  resetFilters,
  setOrigin 
} from '../store/filtersSlice';

const Browse: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetCarsQuery({ limit: 1000 });
  const filters = useAppSelector(state => state.filters);
  const state = useAppSelector(state => state);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [efficiencyFilter, setEfficiencyFilter] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Helper functions
  const getEfficiencyRating = (mpg: number) => {
    if (mpg >= 30) return { rating: 'Excellent', color: 'text-green-800', bgColor: 'bg-green-100' };
    if (mpg >= 25) return { rating: 'Good', color: 'text-blue-800', bgColor: 'bg-blue-100' };
    if (mpg >= 20) return { rating: 'Fair', color: 'text-yellow-800', bgColor: 'bg-yellow-100' };
    return { rating: 'Poor', color: 'text-red-800', bgColor: 'bg-red-100' };
  };

  const getOriginName = (originCode: number): string => {
    switch (originCode) {
      case 1: return '🇺🇸 United States';
      case 2: return '🇪🇺 Europe';
      case 3: return '🇯🇵 Japan';
      default: return 'Unknown';
    }
  };

  const getOriginFlag = (origin: number) => {
    switch (origin) {
      case 1: return '🇺🇸';
      case 2: return '🇪🇺';
      case 3: return '🇯🇵';
      default: return '🌍';
    }
  };

  const isEfficiencySearch = (searchTerm: string) => {
    const efficiencyTerms = ['excellent', 'good', 'fair', 'poor'];
    return efficiencyTerms.some(term => searchTerm.toLowerCase().includes(term));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
    setEfficiencyFilter('all');
    setCurrentPage(1);
  };

  const paginatedData = useMemo(() => {
    if (!data?.data) return { cars: [], totalFiltered: 0, totalPages: 0 };

    let filtered = data.data.filter((car: any) => {
      const matchesSearch = filters.search 
        ? (car.carName.toLowerCase().includes(filters.search.toLowerCase()) ||
           (isEfficiencySearch(filters.search) && 
            getEfficiencyRating(car.mpg).rating.toLowerCase().includes(filters.search.toLowerCase())))
        : true;
      
      const matchesYear = (!filters.minYear || car.modelYear >= filters.minYear) &&
                         (!filters.maxYear || car.modelYear <= filters.maxYear);
      
      const matchesOrigin = !filters.origin || car.origin === filters.origin;
      
      const matchesEfficiency = efficiencyFilter === 'all' || 
                               getEfficiencyRating(car.mpg).rating.toLowerCase() === efficiencyFilter;
      
      return matchesSearch && matchesYear && matchesOrigin && matchesEfficiency;
    });

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'mpg':
          return (a.mpg - b.mpg) * multiplier;
        case 'year':
          return (a.modelYear - b.modelYear) * multiplier;
        case 'make':
          return a.carName.localeCompare(b.carName) * multiplier;
        default:
          return 0;
      }
    });

    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCars = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      cars: paginatedCars,
      totalFiltered,
      totalPages
    };
  }, [data?.data, filters, efficiencyFilter, currentPage, itemsPerPage]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vehicles</h1>
          <p className="text-gray-600">
            {isLoading 
              ? 'Loading vehicles...' 
              : `Displaying ${paginatedData.cars.length} of ${paginatedData.totalFiltered || 0} vehicles`
            }
            {efficiencyFilter !== 'all' && (
              <span className="text-primary-600 font-medium"> • Filtered by {efficiencyFilter} efficiency</span>
            )}
          </p>
          {data?.data && data.data.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Search, filter, and save your favorite vehicles • Click hearts to add to favorites
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {showFilters ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
          </button>
          
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by vehicle name (e.g., 'toyota corolla') or efficiency rating (e.g., 'excellent', 'good')"
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {filters.search && isEfficiencySearch(filters.search) && (
          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            🔍 Searching by efficiency rating: <strong>{filters.search}</strong>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={resetAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1970"
                  max="2025"
                  value={filters.minYear || ''}
                  onChange={(e) => dispatch(setYearRange({ 
                    min: e.target.value ? parseInt(e.target.value) : null, 
                    max: filters.maxYear 
                  }))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="1970"
                  max="2025"
                  value={filters.maxYear || ''}
                  onChange={(e) => dispatch(setYearRange({ 
                    min: filters.minYear, 
                    max: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efficiency Rating
              </label>
              <select
                value={efficiencyFilter}
                onChange={(e) => {
                  setEfficiencyFilter(e.target.value as 'all' | 'excellent' | 'good' | 'fair' | 'poor');
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Ratings</option>
                <option value="excellent">🟢 Excellent (30+ MPG)</option>
                <option value="good">🔵 Good (25-29 MPG)</option>
                <option value="fair">🟡 Fair (20-24 MPG)</option>
                <option value="poor">🔴 Poor (Below 20 MPG)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <select
                value={filters.origin || ''}
                onChange={(e) => {
                  dispatch(setOrigin(e.target.value ? parseInt(e.target.value) : null));
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Origins</option>
                <option value="1">🇺🇸 United States</option>
                <option value="2">🇪🇺 Europe</option>
                <option value="3">🇯🇵 Japan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => dispatch(setSorting({ 
                    sortBy: e.target.value, 
                    sortOrder: filters.sortOrder 
                  }))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="year">Year</option>
                  <option value="mpg">MPG</option>
                  <option value="make">Make</option>
                </select>
                <button
                  onClick={() => dispatch(setSorting({ 
                    sortBy: filters.sortBy, 
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Filters Summary */}
      {(filters.search || filters.minYear || filters.maxYear || filters.origin || efficiencyFilter !== 'all') && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary-800">Active Filters:</span>
              <div className="flex items-center space-x-2">
                {filters.search && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isEfficiencySearch(filters.search) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-primary-100 text-primary-800'
                  }`}>
                    {isEfficiencySearch(filters.search) ? 'Efficiency' : 'Search'}: "{filters.search}"
                  </span>
                )}
                {(filters.minYear || filters.maxYear) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Year: {filters.minYear || 'Any'} - {filters.maxYear || 'Any'}
                  </span>
                )}
                {efficiencyFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Efficiency: {efficiencyFilter.charAt(0).toUpperCase() + efficiencyFilter.slice(1)}
                  </span>
                )}
                {filters.origin && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Origin: {getOriginName(filters.origin)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={resetAllFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {paginatedData.cars.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.minYear || filters.maxYear || efficiencyFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters to find more vehicles.'
                  : 'No vehicle data is currently available.'
                }
              </p>
              {(filters.search || filters.minYear || filters.maxYear || efficiencyFilter !== 'all') && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
            {paginatedData.cars.map((car: any, index: number) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Fuel className="h-5 w-5 text-primary-600" />
                        <span className="font-semibold text-lg text-primary-600">
                          {car.mpg} MPG
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyRating(car.mpg).bgColor} ${getEfficiencyRating(car.mpg).color}`}>
                          {getEfficiencyRating(car.mpg).rating}
                        </div>
                        <button
                          onClick={() => dispatch(toggleFavorite(car))}
                          className={`p-2 rounded-full transition-colors ${
                            state.favorites.items.some(fav => fav.id === car.id)
                              ? 'text-red-600 hover:text-red-700 bg-red-50' 
                              : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                          }`}
                        >
                          <Heart 
                            className={`h-5 w-5 ${
                              state.favorites.items.some(fav => fav.id === car.id) ? 'fill-current' : ''
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-1">
                      {car.carName}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Year
                        </div>
                        <span className="font-medium text-gray-900">{car.modelYear}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Settings className="h-4 w-4 mr-1" />
                          Cylinders
                        </div>
                        <span className="font-medium text-gray-900">{car.cylinders}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Gauge className="h-4 w-4 mr-1" />
                          Engine
                        </div>
                        <span className="font-medium text-gray-900">{car.displacement}L</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-4 w-4 mr-1" />
                          Origin
                        </div>
                        <span className="font-medium text-gray-900">
                          {getOriginFlag(car.origin)} {getOriginName(car.origin)}
                        </span>
                      </div>
                      
                      {car.horsepower && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Zap className="h-4 w-4 mr-1" />
                            Power
                          </div>
                          <span className="font-medium text-gray-900">{car.horsepower} HP</span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/car/${car.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-5 w-5 text-primary-600" />
                            <span className="font-semibold text-lg text-primary-600">
                              {car.mpg} MPG
                            </span>
                          </div>
                          
                          <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {car.carName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {car.modelYear}
                              </span>
                              <span className="flex items-center">
                                <Settings className="h-4 w-4 mr-1" />
                                {car.cylinders} cyl
                              </span>
                              <span className="flex items-center">
                                <Gauge className="h-4 w-4 mr-1" />
                                {car.displacement}L
                              </span>
                              <span className="flex items-center">
                                <Globe className="h-4 w-4 mr-1" />
                                {getOriginFlag(car.origin)} {getOriginName(car.origin)}
                              </span>
                              {car.horsepower && (
                                <span className="flex items-center">
                                  <Zap className="h-4 w-4 mr-1" />
                                  {car.horsepower} HP
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEfficiencyRating(car.mpg).bgColor} ${getEfficiencyRating(car.mpg).color}`}>
                            {getEfficiencyRating(car.mpg).rating}
                          </div>
                          
                          <button
                            onClick={() => dispatch(toggleFavorite(car))}
                            className={`p-2 rounded-full transition-colors ${
                              state.favorites.items.some(fav => fav.id === car.id)
                                ? 'text-red-600 hover:text-red-700 bg-red-50' 
                                : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                            }`}
                          >
                            <Heart 
                              className={`h-6 w-6 ${
                                state.favorites.items.some(fav => fav.id === car.id) ? 'fill-current' : ''
                              }`} 
                            />
                          </button>
                          
                          <Link
                            to={`/car/${car.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
          )}

          {/* Pagination */}
          {paginatedData.totalPages > 1 && paginatedData.cars.length > 0 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg ${
                        page === currentPage 
                          ? 'bg-primary-600 text-white' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === paginatedData.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
