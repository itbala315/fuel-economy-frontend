import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and trying to access login page, redirect to home
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
    // If user is not authenticated and not on login page, redirect to login
    else if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, location.pathname, location, navigate]);

  return <>{children}</>;
};

export default AuthRedirect;
