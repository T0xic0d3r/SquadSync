import React from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTeam from './pages/CreateTeam'
import JoinTeam from './pages/JoinTeam'
import CreateTask from './pages/CreateTask'
import TaskDetails from './pages/TaskDetails'
import Leaderboard from './pages/Leaderboard'
import TeamView from './pages/TeamView'

function Navigation() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  if (!user) return null

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{ backgroundColor: 'white', padding: '15px 20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Dashboard</Link>
      <Link to="/create-task" style={{ color: '#28a745', textDecoration: 'none' }}>➕ New Task</Link>
      <Link to="/create-team" style={{ color: '#667eea', textDecoration: 'none' }}>👥 Create Team</Link>
      <Link to="/join-team" style={{ color: '#17a2b8', textDecoration: 'none' }}>🔗 Join Team</Link>
      <Link to="/team" style={{ color: '#17a2b8', textDecoration: 'none' }}>👥 My Team</Link>
      <Link to="/leaderboard" style={{ color: '#fd7e14', textDecoration: 'none' }}>🏆 Leaderboard</Link>
      <span style={{ color: '#666', fontSize: '14px' }}>👤 {user.username}</span>
      <button onClick={handleLogout} style={{ padding: '6px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
    </nav>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create-team" element={<PrivateRoute><CreateTeam /></PrivateRoute>} />
            <Route path="/join-team" element={<PrivateRoute><JoinTeam /></PrivateRoute>} />
            <Route path="/create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
            <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            <Route path="/team" element={<PrivateRoute><TeamView /></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
