import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
