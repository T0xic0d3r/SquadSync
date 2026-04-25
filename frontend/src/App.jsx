import React from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
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
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  
  return (
    <nav style={{ backgroundColor: 'white', padding: '15px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Link to="/dashboard" style={{ color: '#667eea', textDecoration: 'none' }}>Dashboard</Link>
      {user.teamId ? (
        <>
          <Link to="/create-task" style={{ color: '#28a745', textDecoration: 'none' }}>Create Task</Link>
          <Link to="/team" style={{ color: '#17a2b8', textDecoration: 'none' }}>My Team</Link>
          <Link to="/leaderboard" style={{ color: '#fd7e14', textDecoration: 'none' }}>Leaderboard</Link>
        </>
      ) : (
        <>
          <Link to="/create-team" style={{ color: '#28a745', textDecoration: 'none' }}>Create Team</Link>
          <Link to="/join-team" style={{ color: '#17a2b8', textDecoration: 'none' }}>Join Team</Link>
        </>
      )}
      <button onClick={handleLogout} style={{ padding: '5px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/join-team" element={<JoinTeam />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/team" element={<TeamView />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
