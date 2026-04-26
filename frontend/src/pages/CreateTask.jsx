import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function CreateTask() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await api.post('/tasks/', {
        title,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        priority,
        status: 'TODO',
      })
      setMessage('✅ Task created!')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const data = err.response?.data
      setMessage('❌ ' + (data ? Object.values(data).flat().join(' ') : 'Failed to create task'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center', marginBottom: '20px' }}>Create New Task</h1>
      {message && (
        <div style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Title *</label>
          <input type="text" placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea placeholder="Describe the task..." value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deadline</label>
          <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#aaa' : '#667eea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default CreateTask
