import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Trash2, Calendar, Fuel, AlertCircle } from 'lucide-react';
import { RootState } from '../store';
import { removeFavorite, clearFavorites } from '../store/favoritesSlice';
import { FavoriteItem } from '../types';

const Favorites: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites);

  // Filter out any invalid favorites on component mount
  useEffect(() => {
    const validFavorites = favorites.items.filter((favorite: FavoriteItem) => 
      favorite && 
      favorite.id && 
      favorite.name && 
      favorite.year && 
      favorite.mpg && 
      favorite.addedAt
    );
    
    // If we found invalid favorites, clean them up
    if (validFavorites.length !== favorites.items.length) {
      console.log('Cleaning up invalid favorites');
      // Remove invalid favorites one by one
      favorites.items.forEach((favorite: FavoriteItem) => {
        if (!favorite || !favorite.id || !favorite.name || !favorite.year || !favorite.mpg || !favorite.addedAt) {
          dispatch(removeFavorite(favorite?.id || ''));
        }
      });
    }
  }, [favorites.items, dispatch]);

  const handleRemove = (id: string) => {
    if (!id) {
      console.error('Cannot remove favorite: invalid ID');
      return;
    }
    dispatch(removeFavorite(id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      dispatch(clearFavorites());
    }
  };

  // Filter out any undefined or invalid favorites for display
  const validFavorites = favorites.items.filter((favorite: FavoriteItem) => 
    favorite && 
    favorite.id && 
    favorite.name && 
    favorite.year && 
    favorite.mpg && 
    favorite.addedAt
  );

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
              {validFavorites.length} saved vehicle{validFavorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {validFavorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {validFavorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring vehicles to add them to your favorites. Your favorites will be saved automatically and persist across browser sessions.
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validFavorites.map((favorite, index) => {
              // Additional safety check for each favorite
              if (!favorite || !favorite.id) {
                return null;
              }
              
              return (
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
                        {favorite.mpg || 'N/A'} MPG
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(favorite.id)}
                      className="p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      title="Remove from favorites"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {favorite.name || 'Unknown Vehicle'}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    {favorite.year || 'Unknown Year'}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Added {favorite.addedAt ? new Date(favorite.addedAt).toLocaleDateString() : 'Unknown Date'}
                  </div>
                  
                  {/* Link to car details if we can construct the ID */}
                  {favorite.id && (
                    <Link
                      to={`/car/${favorite.id}`}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Show warning if there are invalid favorites */}
        {favorites.items.length !== validFavorites.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">
                Some invalid favorites were automatically removed. Your valid favorites are displayed above.
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Favorites;
