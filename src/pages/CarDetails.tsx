import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Fuel,
  Calendar,
  Settings,
  Gauge,
  Globe,
  Award,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useGetCarByIdQuery } from '../services/api';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleFavorite } from '../store/favoritesSlice';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);
  
  const { data: car, isLoading, error } = useGetCarByIdQuery(Number(id));
  
  const isFavorite = car ? favorites.some((fav: any) => fav.id === car.id.toString()) : false;

  const handleToggleFavorite = () => {
    if (car) {
      dispatch(toggleFavorite(car));
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

  const getOriginName = (origin: number) => {
    switch (origin) {
      case 1: return 'United States';
      case 2: return 'Europe';
      case 3: return 'Japan';
      default: return 'Unknown';
    }
  };

  const getEfficiencyRating = (mpg: number) => {
    if (mpg >= 30) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (mpg >= 25) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (mpg >= 20) return { rating: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { rating: 'Below Average', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <Link to="/browse" className="flex items-center text-primary-600 hover:text-primary-700 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Browse
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">
              <Fuel className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Car not found</p>
              <p className="mt-2">The vehicle you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const efficiency = getEfficiencyRating(car.mpg);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/browse" className="flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Browse
          </Link>
          
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.carName}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{getOriginFlag(car.origin)} {getOriginName(car.origin)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{car.modelYear}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full ${efficiency.bgColor}`}>
                  <span className={`text-sm font-medium ${efficiency.color}`}>
                    {efficiency.rating}
                  </span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-primary-50 rounded-full p-3 w-fit mx-auto mb-2">
                    <Fuel className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{car.mpg}</div>
                  <div className="text-sm text-gray-600">MPG</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-50 rounded-full p-3 w-fit mx-auto mb-2">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{car.cylinders}</div>
                  <div className="text-sm text-gray-600">Cylinders</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-50 rounded-full p-3 w-fit mx-auto mb-2">
                    <Gauge className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{car.horsepower || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Horsepower</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-50 rounded-full p-3 w-fit mx-auto mb-2">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{car.acceleration}</div>
                  <div className="text-sm text-gray-600">0-60 mph (sec)</div>
                </div>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600" />
                Detailed Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Engine Displacement</span>
                    <span className="font-medium text-gray-900">{car.displacement} cu in</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Vehicle Weight</span>
                    <span className="font-medium text-gray-900">{car.weight.toLocaleString()} lbs</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Acceleration (0-60)</span>
                    <span className="font-medium text-gray-900">{car.acceleration} seconds</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Model Year</span>
                    <span className="font-medium text-gray-900">{car.modelYear}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Number of Cylinders</span>
                    <span className="font-medium text-gray-900">{car.cylinders}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Origin</span>
                    <span className="font-medium text-gray-900">{getOriginFlag(car.origin)} {getOriginName(car.origin)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Efficiency Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Efficiency Analysis
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${efficiency.bgColor}`}>
                  <div className={`text-sm font-medium ${efficiency.color}`}>
                    Fuel Efficiency Rating
                  </div>
                  <div className={`text-lg font-bold ${efficiency.color}`}>
                    {efficiency.rating}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {car.mpg} MPG overall
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>
                    This vehicle's fuel economy of <strong>{car.mpg} MPG</strong> places it in the 
                    <strong> {efficiency.rating.toLowerCase()}</strong> category for vehicles of its era.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isFavorite
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                <Link
                  to="/visualizations"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Link>
                
                <Link
                  to="/browse"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Browse Similar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarDetails;
