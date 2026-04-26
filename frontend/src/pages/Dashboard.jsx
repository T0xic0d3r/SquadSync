import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchUser()
    fetchTasks()
  }, [])

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) setUser(await res.json())
      else { localStorage.clear(); navigate('/login') }
    } catch (err) { console.error(err) }
  }

  const fetchTasks = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/tasks/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(Array.isArray(data) ? data : data.results || [])
      }
    } catch (err) { console.error(err) }
  }

  if (!user) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>

  const todoTasks = tasks.filter(t => t.status === 'TODO')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter(t => t.status === 'DONE')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* User Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>👤 Welcome</h3>
          <p style={{ fontSize: '20px', color: '#667eea', fontWeight: 'bold' }}>{user.username}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>📋 Total Tasks</h3>
          <p style={{ fontSize: '32px', color: '#667eea', fontWeight: 'bold' }}>{tasks.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>✅ Done</h3>
          <p style={{ fontSize: '32px', color: '#28a745', fontWeight: 'bold' }}>{doneTasks.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>🔄 In Progress</h3>
          <p style={{ fontSize: '32px', color: '#ffc107', fontWeight: 'bold' }}>{inProgressTasks.length}</p>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📋 My Tasks</h3>
          <button onClick={() => navigate('/create-task')} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: '#666' }}>No tasks yet.</p>
            <button onClick={() => navigate('/create-task')} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Create your first task
            </button>
          </div>
        ) : (
          <>
            {todoTasks.map(t => <TaskCard key={t.id} task={t} />)}
            {inProgressTasks.map(t => <TaskCard key={t.id} task={t} />)}
            {doneTasks.map(t => <TaskCard key={t.id} task={t} />)}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
