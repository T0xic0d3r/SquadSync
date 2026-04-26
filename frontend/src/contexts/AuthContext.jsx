import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    const { access, refresh } = res.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refresh', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    const meRes = await api.get('/auth/users/me/');
    localStorage.setItem('user', JSON.stringify(meRes.data));
    setUser(meRes.data);
    return meRes.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register/', data);
    const { tokens, ...userData } = res.data;
    localStorage.setItem('token', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
