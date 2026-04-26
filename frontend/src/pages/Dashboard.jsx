import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [team, setTeam] = useState(null)
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchUser()
    fetchTasks()
  }, [])

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setUser(data)
    if (data.teamId) {
      fetchTeam(data.teamId)
      fetchStats(data.teamId)
    }
  }

  const fetchTeam = async (teamId) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:8080/api/teams/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setTeam(data)
  }

  const fetchStats = async (teamId) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:8080/api/teams/${teamId}/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setStats(data)
  }

  const fetchTasks = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/tasks/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setTasks(data)
  }

  if (!user) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>

  const pendingTasks = tasks.filter(t => t.status === 'PENDING')
  const submittedTasks = tasks.filter(t => t.status === 'SUBMITTED')
  const approvedTasks = tasks.filter(t => t.status === 'APPROVED')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>📊 Your Score</h3>
          <p style={{ fontSize: '32px', color: '#667eea', fontWeight: 'bold' }}>{user.score}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>🔥 Streak</h3>
          <p style={{ fontSize: '32px', color: '#fd7e14', fontWeight: 'bold' }}>{user.streak} days</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>✅ Reliability</h3>
          <p style={{ fontSize: '32px', color: '#28a745', fontWeight: 'bold' }}>{user.reliabilityScore}%</p>
        </div>
        {stats && (
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <h3>👥 Team Tasks</h3>
            <p style={{ fontSize: '32px', color: '#ffc107', fontWeight: 'bold' }}>{stats.totalTasks}</p>
          </div>
        )}
      </div>

      {/* Team Info */}
      {team && (
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <h3>🏢 Your Team: {team.name}</h3>
          <p>Invite Code: <code style={{ backgroundColor: '#f8f9fa', padding: '5px 10px', borderRadius: '5px' }}>{team.inviteCode}</code></p>
          <button onClick={() => navigate('/team')} style={{ padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px' }}>View Team Members</button>
        </div>
      )}

      {/* Tasks Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #dee2e6' }}>
          <h3>📋 Pending ({pendingTasks.length})</h3>
          <h3 style={{ color: '#ffc107' }}>Submitted ({submittedTasks.length})</h3>
          <h3 style={{ color: '#28a745' }}>Approved ({approvedTasks.length})</h3>
        </div>
        
        {pendingTasks.length > 0 && pendingTasks.map(t => <TaskCard key={t.id} task={t} />)}
        {submittedTasks.length > 0 && submittedTasks.map(t => <TaskCard key={t.id} task={t} />)}
        {approvedTasks.length > 0 && approvedTasks.map(t => <TaskCard key={t.id} task={t} />)}
        
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>No tasks yet. Create your first task!</p>
            <button onClick={() => navigate('/create-task')} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px' }}>Create Task</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
