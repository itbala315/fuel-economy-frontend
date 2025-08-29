import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';
import { 
  Home, 
  BarChart3, 
  PieChart, 
  Heart, 
  Info, 
  Menu, 
  X,
  Fuel,
  Github,
  Mail,
  Search,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Browse Vehicles', href: '/browse', icon: Search },
    { name: 'Visualizations', href: '/visualizations', icon: PieChart },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-primary-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-primary-100 text-primary-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Fuel className="h-6 w-6 text-surface" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary-50">Fuel Economy</h1>
                <p className="text-xs text-primary-200">Data Explorer</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active 
                      ? 'bg-primary-50 text-surface' 
                      : 'text-primary-200 hover:bg-primary-800 hover:text-primary-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-surface' : 'text-primary-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <ThemeSelector />
            
        
            
            {/* User Info / Login */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-sm">
                  <div className="text-primary-50 font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-primary-200 text-xs">
                    {user?.email}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-50 p-2 rounded-full">
                    <User className="h-4 w-4 text-surface" />
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-primary-200 hover:text-primary-50 hover:bg-primary-800 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-surface rounded-lg hover:bg-primary-100 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-xl lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-primary-800">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                <Fuel className="h-5 w-5 text-surface" />
              </div>
              <span className="font-bold text-primary-50">Fuel Economy</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-primary-800 text-primary-200 hover:text-primary-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active 
                      ? 'bg-primary-50 text-surface' 
                      : 'text-primary-200 hover:bg-primary-800 hover:text-primary-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-surface' : 'text-primary-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                  <Fuel className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Fuel Economy Explorer</span>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive fuel economy analysis platform helping you make informed decisions 
                about vehicle efficiency and environmental impact.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href} 
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Compare Vehicle Fuel Efficiency</li>
                <li>• Analyze Cost Savings</li>
                <li>• Environmental Impact Assessment</li>
                <li>• Historical Trend Analysis</li>
                <li>• Smart Filtering & Search</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 Fuel Economy Explorer. Empowering smart vehicle choices.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
