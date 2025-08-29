import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthRedirect from './components/AuthRedirect';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import CarDetails from './pages/CarDetails';
import Visualizations from './pages/Visualizations';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Login from './pages/Login';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AuthRedirect>
              <Routes>
                {/* Public route - Login page without Layout */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes with Layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Home />
                    </Layout>
                  </ProtectedRoute>
                } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/browse" element={
                <ProtectedRoute>
                  <Layout>
                    <Browse />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/car/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <CarDetails />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/visualizations" element={
                <ProtectedRoute>
                  <Layout>
                    <Visualizations />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Layout>
                    <Favorites />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/about" element={
                <ProtectedRoute>
                  <Layout>
                    <About />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </AuthRedirect>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
