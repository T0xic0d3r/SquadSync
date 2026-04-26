import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <nav style={{ backgroundColor: 'white', padding: '15px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <span onClick={() => navigate('/dashboard')} style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>SquadSync</span>
        <span onClick={() => navigate('/dashboard')} style={{ color: '#667eea', cursor: 'pointer' }}>Dashboard</span>
        <span onClick={() => navigate('/team')} style={{ color: '#17a2b8', cursor: 'pointer' }}>Team</span>
        <span onClick={() => navigate('/leaderboard')} style={{ color: '#fd7e14', cursor: 'pointer' }}>Leaderboard</span>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '5px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </nav>
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
