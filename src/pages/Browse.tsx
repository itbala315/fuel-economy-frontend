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
  ChevronDown
} from 'lucide-react';
import { useGetCarsQuery } from '../services/api';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleFavorite } from '../store/favoritesSlice';
import { Car } from '../types';

const Browse: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: cars, isLoading } = useGetCarsQuery({ limit: 1000 });
  const favorites = useAppSelector(state => state.favorites.items);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'mpg' | 'year'>('name');
  const [filterOrigin, setFilterOrigin] = useState<'all' | 1 | 2 | 3>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedCars = useMemo(() => {
    if (!cars?.data) return [];

    let filtered = cars.data.filter(car => {
      const matchesSearch = car.carName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOrigin = filterOrigin === 'all' || car.origin === filterOrigin;
      return matchesSearch && matchesOrigin;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'mpg':
          return b.mpg - a.mpg;
        case 'year':
          return b.modelYear - a.modelYear;
        case 'name':
        default:
          return a.carName.localeCompare(b.carName);
      }
    });

    return filtered;
  }, [cars?.data, searchTerm, sortBy, filterOrigin]);

  const handleToggleFavorite = (car: Car) => {
    dispatch(toggleFavorite(car));
  };

  const getOriginFlag = (origin: number) => {
    switch (origin) {
      case 1: return '🇺🇸';
      case 2: return '🇪🇺';
      case 3: return '🇯🇵';
      default: return '�';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Vehicles</h1>
            <p className="text-gray-600">
              Explore our comprehensive database of {cars?.data?.length || 0} vehicles
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="mpg">Fuel Economy (High to Low)</option>
                    <option value="year">Year (Newest First)</option>
                  </select>
                </div>

                {/* Origin Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <select
                    value={filterOrigin}
                    onChange={(e) => setFilterOrigin(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as 1 | 2 | 3)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Origins</option>
                    <option value={1}>🇺🇸 USA</option>
                    <option value={2}>🇪🇺 Europe</option>
                    <option value={3}>🇯🇵 Japan</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedCars.length} of {cars?.data?.length || 0} vehicles
          </p>
        </div>

        {/* Vehicle Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {car.carName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {getOriginFlag(car.origin)} {car.modelYear}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(car)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.some((fav: any) => fav.id === car.id.toString())
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.some((fav: any) => fav.id === car.id.toString()) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-primary-600" />
                        <span className="text-sm text-gray-600">MPG</span>
                      </div>
                      <span className="font-semibold text-primary-600">{car.mpg}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Year</span>
                      </div>
                      <span className="text-sm text-gray-900">{car.modelYear}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Cylinders</span>
                      </div>
                      <span className="text-sm text-gray-900">{car.cylinders}</span>
                    </div>
                  </div>

                  <Link
                    to={`/car/${car.id}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{car.carName}</h3>
                      <span className="text-sm text-gray-500">{getOriginFlag(car.origin)} {car.modelYear}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-primary-600" />
                        <span>{car.mpg} MPG</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span>{car.cylinders} Cylinders</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFavorite(car)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.some((fav: any) => fav.id === car.id.toString())
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.some((fav: any) => fav.id === car.id.toString()) ? 'fill-current' : ''}`} />
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
              </motion.div>
            ))}
          </div>
        )}

        {filteredAndSortedCars.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Browse;
