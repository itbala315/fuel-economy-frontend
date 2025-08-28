import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  Heart,
  Star,
  Fuel,
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  setSearch, 
  setYearRange, 
  setSorting, 
  resetFilters 
} from '../store/filtersSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { useGetCarsQuery } from '../services/api';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const favorites = useSelector((state: RootState) => state.favorites);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get data with current filters
  const { data, isLoading, error } = useGetCarsQuery({
    search: filters.search,
    minYear: filters.minYear,
    maxYear: filters.maxYear,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    limit: 1000 // Get all for client-side pagination
  });

  // Client-side pagination
  const paginatedData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return { cars: [], totalPages: 0 };
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const cars = data.data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.data.length / itemsPerPage);
    
    return { cars, totalPages };
  }, [data?.data, currentPage, itemsPerPage]);

  const handleFavoriteToggle = (car: any) => {
    if (favorites.items.some(fav => fav.id === car.id)) {
      dispatch(removeFavorite(car.id));
    } else {
      dispatch(addFavorite({
        name: `${car.make} ${car.model}`,
        year: car.year,
        mpg: car.mpg,
        addedAt: Date.now()
      }));
    }
  };

  const isFavorite = (carId: string) => {
    return favorites.items.some(fav => fav.id === carId);
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${data?.pagination?.total || 0} vehicles found`}
          </p>
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
          placeholder="Search by make, model, or year..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <button
                        onClick={() => handleFavoriteToggle(car)}
                        className={`p-1 rounded-full transition-colors ${
                          isFavorite(car.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite(car.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2">
                      {car.make} {car.model}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {car.year}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {car.cylinders} cyl • {car.displacement}L
                      </span>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Fuel className="h-5 w-5 text-primary-600" />
                          <span className="font-semibold text-lg text-primary-600">
                            {car.mpg} MPG
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">
                          {car.make} {car.model}
                        </h3>
                        <span className="text-gray-600">{car.year}</span>
                        <span className="text-sm text-gray-500">
                          {car.cylinders} cyl • {car.displacement}L
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFavoriteToggle(car)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite(car.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite(car.id) ? 'fill-current' : ''}`} />
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.totalPages > 1 && (
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

export default Dashboard;
