import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  Heart, 
  Search,
  TrendingUp,
  ArrowRight,
  Database,
  Filter,
  Eye,
  Zap
} from 'lucide-react';
import { useGetStatisticsQuery } from '../services/api';

const Home: React.FC = () => {
  const { data: stats, isLoading } = useGetStatisticsQuery();

  const features = [
    {
      icon: BarChart3,
      title: 'Interactive Dashboard',
      description: 'Explore automotive data with advanced filtering and real-time search capabilities.',
      link: '/dashboard',
      color: 'bg-black'
    },
    {
      icon: PieChart,
      title: 'Data Visualizations',
      description: 'Beautiful interactive charts and graphs to understand fuel economy trends.',
      link: '/visualizations',
      color: 'bg-gray-800'
    },
    {
      icon: Heart,
      title: 'Favorites System',
      description: 'Save and manage your favorite vehicles with local storage persistence.',
      link: '/favorites',
      color: 'bg-gray-600'
    }
  ];

  const highlights = [
    {
      icon: Database,
      title: 'Rich Dataset',
      description: 'Comprehensive automotive fuel economy data from EPA',
      value: stats?.totalCars.toLocaleString() || '---'
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Filter by make, model, year, fuel type, and more',
      value: `${Object.keys(stats?.originDistribution || {}).length} Origins`
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Analyze fuel economy trends across years',
      value: `${stats?.yearRange?.min || 0}-${stats?.yearRange?.max || 0}`
    },
    {
      icon: Zap,
      title: 'Cost Savings',
      description: 'Make informed decisions to optimize fuel efficiency and reduce operational costs',
      value: 'ROI Focused'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-8"
        >
          <Zap className="h-10 w-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
          Fuel Economy
        </h1>
            
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              Explore Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
          
          <Link to="/visualizations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-white text-black font-semibold rounded-lg border-2 border-black hover:bg-gray-100 transition-colors"
            >
              View Charts
              <PieChart className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      {!isLoading && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{highlight.description}</p>
                <p className="text-2xl font-bold text-primary-600">{highlight.value}</p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools for exploring and analyzing automotive fuel economy data
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={feature.link}>
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:border-primary-200">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Stats */}
      {!isLoading && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Dataset Overview</h2>
            <p className="text-primary-100">Key statistics from our automotive database</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalCars.toLocaleString()}</div>
              <div className="text-primary-100">Total Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{Object.keys(stats?.originDistribution || {}).length}</div>
              <div className="text-primary-100">Car Origins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{parseFloat(stats?.avgMpg || '0').toFixed(1)}</div>
              <div className="text-primary-100">Average MPG</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {stats.yearRange.max - stats.yearRange.min + 1}
              </div>
              <div className="text-primary-100">Years Covered</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="text-center py-16 px-4 bg-gray-50 rounded-2xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Explore?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Start discovering insights in automotive fuel economy data with our interactive tools
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Start Exploring
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
