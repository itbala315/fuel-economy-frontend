import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Heart, 
  BarChart3, 
  Smartphone, 
  Database,
  Github,
  Mail
} from 'lucide-react';

const About: React.FC = () => {
  const technologies = [
    { name: 'React 18', description: 'Modern React with TypeScript for type safety' },
    { name: 'Redux Toolkit', description: 'Elegant state management with RTK Query' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid styling' },
    { name: 'D3.js', description: 'Powerful data visualization library' },
    { name: 'Framer Motion', description: 'Smooth animations and transitions' },
    { name: 'Node.js', description: 'Express backend serving CSV data via REST API' }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Interactive Dashboard',
      description: 'Advanced filtering, sorting, and search capabilities with real-time updates'
    },
    {
      icon: Heart,
      title: 'Favorites System',
      description: 'Save vehicles with localStorage persistence across browser sessions'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Mobile-first approach with Tailwind CSS for all screen sizes'
    },
    {
      icon: Database,
      title: 'RESTful API',
      description: 'Clean backend architecture serving automotive fuel economy data'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="text-center py-16">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-8"
          >
            <Zap className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About This Project
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive fuel economy data explorer built for the WEX take-home challenge, 
            demonstrating modern web development practices and interactive data visualization.
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Project Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Requirements</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  React single-page application with 5+ routes
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Interactive dashboard with filtering and search
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Data visualization using D3.js or similar
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Local storage for data persistence
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Responsive design for all devices
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Highlights</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  TypeScript for enhanced type safety
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Redux Toolkit with RTK Query for API calls
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Framer Motion for smooth animations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mobile-first responsive design
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Modern React patterns and hooks
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Technologies Used</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Source */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <div className="text-center">
            <Database className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Source</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              This application uses the Auto MPG dataset, which contains fuel economy data 
              for various automobile models from 1970 to 1982. The dataset includes information 
              about MPG, cylinders, displacement, horsepower, weight, acceleration, model year, 
              and country of origin.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>• 398 Vehicle Records</span>
              <span>• Multiple Manufacturers</span>
              <span>• 1970-1982 Model Years</span>
              <span>• Comprehensive Specifications</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Built for WEX Challenge</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            This project demonstrates modern React development practices, state management, 
            data visualization, and responsive design principles.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="flex items-center text-white hover:text-primary-200 transition-colors">
              <Github className="h-5 w-5 mr-2" />
              View Source
            </a>
            <a href="#" className="flex items-center text-white hover:text-primary-200 transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              Contact
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
