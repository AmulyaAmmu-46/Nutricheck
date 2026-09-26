import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default header and fetch user data
  useEffect(() => {
    if (token) {
      // Fetch user data to validate token
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUser = async () => {
    try {
      // Since we don't have a /me endpoint, we'll just validate the token
      // by trying to fetch profile
      const response = await api.get('/api/profile');
      if (response.data.success) {
        setUser({ id: token }); // Simplified user object
      }
    } catch (error) {
      // If profile doesn't exist (404), that's OK - user just needs to create profile
      // Only logout on actual auth errors (401)
      if (error.response?.status === 401) {
        console.error('Auth error - unauthorized:', error);
        logout();
      } else {
        // Profile doesn't exist yet, but user is authenticated
        setUser({ id: token });
        console.log('Profile not found, user can create one');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    // Set loading to false immediately so navigation can happen
    // fetchUser will run in background via useEffect
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

