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
  const solutions = [
    { name: 'Vehicle Comparison', description: 'Compare fuel efficiency across different vehicle models' },
    { name: 'Cost Analysis', description: 'Calculate potential savings and operating costs' },
    { name: 'Environmental Impact', description: 'Assess carbon footprint and environmental benefits' },
    { name: 'Smart Filtering', description: 'Find vehicles that match your specific requirements' },
    { name: 'Trend Analysis', description: 'Understand historical fuel economy improvements' },
    { name: 'Decision Support', description: 'Data-driven insights for informed vehicle choices' }
  ];

  const benefits = [
    {
      icon: BarChart3,
      title: 'Comprehensive Analysis',
      description: 'Get detailed insights into vehicle performance and efficiency metrics'
    },
    {
      icon: Heart,
      title: 'Personalized Experience',
      description: 'Save your favorite vehicles and create custom comparison lists'
    },
    {
      icon: Smartphone,
      title: 'Accessible Anywhere',
      description: 'Access vehicle data and insights from any device, anytime'
    },
    {
      icon: Database,
      title: 'Reliable Data',
      description: 'Trusted automotive data to support your vehicle purchasing decisions'
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
            About Fuel Economy Explorer
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your trusted platform for making informed vehicle decisions through comprehensive 
            fuel economy analysis and cost-benefit insights.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Platform</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For Consumers</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Compare fuel costs across different vehicle models
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Calculate long-term savings and total cost of ownership
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Understand environmental impact of vehicle choices
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Access comprehensive vehicle specifications
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Make data-driven purchasing decisions
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For Businesses</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Fleet management and optimization insights
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cost reduction through efficient vehicle selection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sustainability reporting and compliance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Budget planning and forecasting tools
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Strategic vehicle procurement guidance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Benefits</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Solutions */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Solutions</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{solution.name}</h3>
                <p className="text-sm text-gray-600">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <div className="text-center">
            <Database className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rich Vehicle Data</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Access comprehensive automotive data spanning over a decade of vehicle models. 
              Our platform provides detailed fuel economy information to help you make 
              informed decisions about vehicle efficiency and cost-effectiveness.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>• 398 Vehicle Models</span>
              <span>• Multiple Manufacturers</span>
              <span>• 1970-1982 Historical Data</span>
              <span>• Detailed Specifications</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Start Making Smarter Vehicle Choices</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our platform for vehicle fuel economy analysis. 
            Make informed decisions that save money and benefit the environment.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="flex items-center text-white hover:text-primary-200 transition-colors">
              <Github className="h-5 w-5 mr-2" />
              Learn More
            </a>
            <a href="#" className="flex items-center text-white hover:text-primary-200 transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              Contact Us
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
