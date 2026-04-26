import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateTask() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [members, setMembers] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.teamId) {
      setMessage('❌ You need to be in a team to create tasks')
      return
    }
    
    try {
      const res = await fetch(`/api/teams/${user.teamId}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setMembers(data)
      if (data.length > 0) setAssignedTo(data[0].id)
    } catch (err) {
      setMessage('❌ Error fetching team members')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!deadline) {
      setMessage('❌ Please select a deadline')
      return
    }
    
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title, 
          description, 
          assignedTo, 
          deadline: new Date(deadline).toISOString(),
          priority 
        })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('✅ Task created successfully!')
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setMessage('❌ ' + (data.message || 'Failed to create task'))
      }
    } catch (err) {
      setMessage('❌ Error creating task')
    }
  }

  if (!members.length && !message) {
    return (
      <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', textAlign: 'center' }}>
        <h2 style={{ color: '#667eea' }}>No Team Found</h2>
        <p>You need to create or join a team first!</p>
        <button onClick={() => navigate('/create-team')} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>Create Team</button>
        <button onClick={() => navigate('/join-team')} style={{ padding: '10px 20px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px' }}>Join Team</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>Create New Task</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Title *</label>
          <input 
            type="text" 
            placeholder="Enter task title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
            required 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea 
            placeholder="Describe the task..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px' }} 
            rows="3" 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assign To *</label>
          <select 
            value={assignedTo} 
            onChange={e => setAssignedTo(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
            required
          >
            {members.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Deadline *</label>
          <input 
            type="datetime-local" 
            value={deadline} 
            onChange={e => setDeadline(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
            required 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority</label>
          <select 
            value={priority} 
            onChange={e => setPriority(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#667eea', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Create Task
        </button>
      </form>
    </div>
  )
}

export default CreateTask
