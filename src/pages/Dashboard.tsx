import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Fuel,
  Calendar,
  Globe,
  Award,
  ArrowRight,
  Database
} from 'lucide-react';
import { useGetCarsQuery, useGetStatisticsQuery } from '../services/api';
import { useAppDispatch } from '../hooks/redux';
import { resetFilters, setSearch, setOrigin } from '../store/filtersSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: cars, isLoading: carsLoading } = useGetCarsQuery({ limit: 1000 });
  const { data: stats, isLoading: statsLoading } = useGetStatisticsQuery();

  const getEfficiencyStats = () => {
    if (!cars?.data) return { excellent: 0, good: 0, fair: 0, poor: 0 };
    
    const counts = cars.data.reduce((acc, car) => {
      if (car.mpg >= 30) acc.excellent++;
      else if (car.mpg >= 25) acc.good++;
      else if (car.mpg >= 20) acc.fair++;
      else acc.poor++;
      return acc;
    }, { excellent: 0, good: 0, fair: 0, poor: 0 });
    
    return counts;
  };

  const getTopPerformers = () => {
    if (!cars?.data) return [];
    return [...cars.data]  // Create a copy of the array first
      .sort((a, b) => b.mpg - a.mpg)
      .slice(0, 5);
  };

  const getOriginStats = () => {
    if (!cars?.data) return { usa: 0, europe: 0, japan: 0 };
    
    return cars.data.reduce((acc, car) => {
      if (car.origin === 1) acc.usa++;
      else if (car.origin === 2) acc.europe++;
      else if (car.origin === 3) acc.japan++;
      return acc;
    }, { usa: 0, europe: 0, japan: 0 });
  };

  const efficiencyStats = getEfficiencyStats();
  const topPerformers = getTopPerformers();
  const originStats = getOriginStats();

  // Navigation handlers for filtering
  const handleEfficiencyFilter = (efficiency: string) => {
    dispatch(resetFilters());
    dispatch(setSearch(efficiency));
    navigate('/browse');
  };

  const handleOriginFilter = (originCode: number) => {
    dispatch(resetFilters());
    dispatch(setOrigin(originCode));
    navigate('/browse');
  };

  if (carsLoading || statsLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Overview of fuel economy data and performance insights
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Vehicles</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalCars.toLocaleString() || cars?.data?.length || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Fuel className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Average MPG</h3>
            <p className="text-3xl font-bold text-green-600">{parseFloat(stats?.avgMpg || '0').toFixed(1)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Year Range</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.yearRange?.min || 0}-{stats?.yearRange?.max || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Excellent Rated</h3>
            <p className="text-3xl font-bold text-orange-600">{efficiencyStats.excellent}</p>
          </motion.div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Efficiency Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Efficiency Distribution</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Click to filter</span>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleEfficiencyFilter('excellent')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Excellent (30+ MPG)</span>
                </div>
                <span className="text-lg font-bold text-green-600">{efficiencyStats.excellent}</span>
              </button>
              <button
                onClick={() => handleEfficiencyFilter('good')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Good (25-29 MPG)</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{efficiencyStats.good}</span>
              </button>
              <button
                onClick={() => handleEfficiencyFilter('fair')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Fair (20-24 MPG)</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{efficiencyStats.fair}</span>
              </button>
              <button
                onClick={() => handleEfficiencyFilter('poor')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Poor (&lt;20 MPG)</span>
                </div>
                <span className="text-lg font-bold text-red-600">{efficiencyStats.poor}</span>
              </button>
            </div>
          </motion.div>

          {/* Origin Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Origin Distribution</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Click to filter</span>
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => handleOriginFilter(1)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">United States</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{originStats.usa}</span>
              </button>
              <button
                onClick={() => handleOriginFilter(2)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🇪🇺</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Europe</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{originStats.europe}</span>
              </button>
              <button
                onClick={() => handleOriginFilter(3)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🇯🇵</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">Japan</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{originStats.japan}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Most Efficient Vehicles</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topPerformers.map((car, index) => (
              <Link
                key={car.id}
                to={`/car/${car.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
                    <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{car.carName}</p>
                    <p className="text-sm text-gray-600">{car.modelYear}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">{car.mpg} MPG</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-semibold mb-4">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/browse"
              className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div>
                <p className="font-medium">Browse Vehicles</p>
                <p className="text-sm text-primary-100">Search and filter vehicles</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/visualizations"
              className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div>
                <p className="font-medium">View Charts</p>
                <p className="text-sm text-primary-100">Interactive visualizations</p>
              </div>
              <BarChart3 className="h-5 w-5" />
            </Link>
            <Link
              to="/favorites"
              className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div>
                <p className="font-medium">My Favorites</p>
                <p className="text-sm text-primary-100">Saved vehicles</p>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
