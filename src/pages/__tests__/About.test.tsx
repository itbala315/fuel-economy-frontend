import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import About from '../About';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('About Component', () => {
  test('renders about page title and description', () => {
    render(<About />);
    
    expect(screen.getByText('About Fuel Economy Explorer')).toBeInTheDocument();
    expect(screen.getByText(/trusted platform for making informed vehicle decisions/i)).toBeInTheDocument();
  });

  test('renders platform overview sections', () => {
    render(<About />);
    
    expect(screen.getByText('Why Choose Our Platform')).toBeInTheDocument();
    expect(screen.getByText('For Consumers')).toBeInTheDocument();
    expect(screen.getByText('For Businesses')).toBeInTheDocument();
  });

  test('renders consumer benefits', () => {
    render(<About />);
    
    expect(screen.getByText('Compare fuel costs across different vehicle models')).toBeInTheDocument();
    expect(screen.getByText('Calculate long-term savings and total cost of ownership')).toBeInTheDocument();
    expect(screen.getByText('Understand environmental impact of vehicle choices')).toBeInTheDocument();
  });

  test('renders business benefits', () => {
    render(<About />);
    
    expect(screen.getByText('Fleet management and optimization insights')).toBeInTheDocument();
    expect(screen.getByText('Cost reduction through efficient vehicle selection')).toBeInTheDocument();
    expect(screen.getByText('Sustainability reporting and compliance')).toBeInTheDocument();
  });

  test('renders key benefits section', () => {
    render(<About />);
    
    expect(screen.getByText('Key Benefits')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Analysis')).toBeInTheDocument();
    expect(screen.getByText('Personalized Experience')).toBeInTheDocument();
    expect(screen.getByText('Accessible Anywhere')).toBeInTheDocument();
    expect(screen.getByText('Reliable Data')).toBeInTheDocument();
  });

  test('renders solutions section', () => {
    render(<About />);
    
    expect(screen.getByText('Our Solutions')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Comparison')).toBeInTheDocument();
    expect(screen.getByText('Cost Analysis')).toBeInTheDocument();
    expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
  });

  test('renders data insights section', () => {
    render(<About />);
    
    expect(screen.getByText('Comprehensive Analysis')).toBeInTheDocument();
    expect(screen.getByText('Personalized Experience')).toBeInTheDocument();
    expect(screen.getByText('Reliable Data')).toBeInTheDocument();
  });

  test('renders call to action section', () => {
    render(<About />);
    
    expect(screen.getByText('Start Making Smarter Vehicle Choices')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });
});
