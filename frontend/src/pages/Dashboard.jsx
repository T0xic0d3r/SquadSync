import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import TaskCard from '../components/TaskCard'
import api from '../services/api'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/')
      const data = res.data
      setTasks(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/`, { status })
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>

  const todoTasks = tasks.filter(t => t.status === 'TODO')
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const doneTasks = tasks.filter(t => t.status === 'DONE')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
          <h3>👤 Welcome</h3>
          <p style={{ fontSize: '20px', color: '#667eea', fontWeight: 'bold' }}>{user?.username}</p>
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

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📋 My Tasks</h3>
          <button onClick={() => navigate('/create-task')} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ New Task</button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: '#666', marginBottom: '15px' }}>No tasks yet.</p>
            <button onClick={() => navigate('/create-task')} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create your first task</button>
          </div>
        ) : (
          <div>
            {tasks.map(t => <TaskCard key={t.id} task={t} onStatusChange={updateStatus} onClick={() => navigate(`/task/${t.id}`)} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
