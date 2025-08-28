import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Trash2, Calendar, Fuel } from 'lucide-react';
import { RootState } from '../store';
import { removeFavorite, clearFavorites } from '../store/favoritesSlice';

const Favorites: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites);

  const handleRemove = (id: string) => {
    dispatch(removeFavorite(id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      dispatch(clearFavorites());
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorites</h1>
            <p className="text-gray-600">
              {favorites.items.length} saved vehicle{favorites.items.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {favorites.items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {favorites.items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring the dashboard to add vehicles to your favorites
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              Browse Vehicles
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.items.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-lg text-primary-600">
                      {favorite.mpg} MPG
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(favorite.id)}
                    className="p-1 rounded-full text-red-500 hover:text-red-600"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2">
                  {favorite.name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {favorite.year}
                </div>
                
                <div className="text-xs text-gray-500">
                  Added {new Date(favorite.addedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Favorites;
