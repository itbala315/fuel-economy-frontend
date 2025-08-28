import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemePreview = (theme: string) => {
    switch (theme) {
      case 'blackWhite':
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          </div>
        );
      case 'blue':
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-100"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        );
      case 'green':
        return (
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-100"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getThemeDisplayName = (theme: string) => {
    switch (theme) {
      case 'blackWhite':
        return 'Black & White';
      case 'blue':
        return 'Blue Ocean';
      case 'green':
        return 'Nature Green';
      default:
        return theme;
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          themeName === 'blackWhite'
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            : themeName === 'blue'
            ? 'bg-blue-50 hover:bg-blue-100 text-blue-800'
            : 'bg-green-50 hover:bg-green-100 text-green-800'
        }`}
      >
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {getThemeDisplayName(themeName)}
        </span>
        <div className="sm:hidden">
          {getThemePreview(themeName)}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Choose Theme
                </div>
                {availableThemes.map((theme) => (
                  <motion.button
                    key={theme}
                    whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                    onClick={() => {
                      setTheme(theme);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                      theme === themeName
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getThemePreview(theme)}
                      <span className="font-medium">{getThemeDisplayName(theme)}</span>
                    </div>
                    {theme === themeName && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="border-t border-gray-200 p-3">
                <p className="text-xs text-gray-500">
                  Theme preference is saved locally
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
