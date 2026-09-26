import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  // Only show loading on initial app load, not after login
  // Check if token exists in localStorage to avoid blocking after login
  const hasToken = token || localStorage.getItem('token');

  if (loading && !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return hasToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

