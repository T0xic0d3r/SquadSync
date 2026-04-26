import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function TaskDetails() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => { fetchTask() }, [id])

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}/`)
      setTask(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status) => {
    try {
      await api.patch(`/tasks/${id}/`, { status })
      setMessage(`✅ Status updated to ${status}`)
      fetchTask()
    } catch (err) {
      setMessage('❌ Failed to update status')
    }
  }

  const deleteTask = async () => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}/`)
      navigate('/dashboard')
    } catch (err) {
      setMessage('❌ Failed to delete task')
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading...</div>
  if (!task) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Task not found. <button onClick={() => navigate('/dashboard')}>Back</button></div>

  const priorityColor = { LOW: '#28a745', MEDIUM: '#ffc107', HIGH: '#dc3545' }
  const statusColor = { TODO: '#6c757d', IN_PROGRESS: '#ffc107', DONE: '#28a745' }

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back</button>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h1 style={{ color: '#667eea', margin: 0 }}>{task.title}</h1>
          <button onClick={deleteTask} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
        </div>

        {message && (
          <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
            {message}
          </div>
        )}

        <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>{task.description || 'No description'}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Priority</strong>
            <div style={{ marginTop: '5px', padding: '4px 10px', backgroundColor: priorityColor[task.priority] || '#6c757d', color: 'white', borderRadius: '5px', display: 'inline-block' }}>{task.priority}</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Status</strong>
            <div style={{ marginTop: '5px', padding: '4px 10px', backgroundColor: statusColor[task.status] || '#6c757d', color: 'white', borderRadius: '5px', display: 'inline-block' }}>{task.status}</div>
          </div>
          {task.deadline && (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Deadline</strong>
              <div style={{ marginTop: '5px', color: '#555' }}>{new Date(task.deadline).toLocaleString()}</div>
            </div>
          )}
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Created</strong>
            <div style={{ marginTop: '5px', color: '#555' }}>{new Date(task.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div>
          <strong style={{ display: 'block', marginBottom: '10px' }}>Update Status:</strong>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['TODO', 'IN_PROGRESS', 'DONE'].map(s => (
              <button key={s} onClick={() => updateStatus(s)} style={{ flex: 1, padding: '10px', backgroundColor: task.status === s ? statusColor[s] : '#f8f9fa', color: task.status === s ? 'white' : '#333', border: '2px solid ' + (statusColor[s] || '#dee2e6'), borderRadius: '5px', cursor: 'pointer', fontWeight: task.status === s ? 'bold' : 'normal' }}>
                {s === 'TODO' ? '📋 To Do' : s === 'IN_PROGRESS' ? '🔄 In Progress' : '✅ Done'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
