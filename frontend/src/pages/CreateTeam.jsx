import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateTeam() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    console.log('Creating team with:', { name, description })
    console.log('User:', user)
    console.log('Token:', token ? 'Present' : 'Missing')

    // Check if user already has a team
    if (user.teamId) {
      setError('You are already in a team. Leave your current team first to create a new one.')
      setLoading(false)
      return
    }

    if (!token) {
      setError('You are not logged in. Please login again.')
      setTimeout(() => navigate('/login'), 2000)
      return
    }
    
    try {
      const res = await fetch('http://localhost:8080/api/teams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      })
      
      const data = await res.json()
      console.log('Response:', data)
      
      if (res.ok) {
        setSuccess(`✅ Team "${name}" created successfully! Invite code: ${data.inviteCode}`)
        
        // Update local storage with new team info
        const updatedUser = { ...user, teamId: data.id, role: 'ADMIN' }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setError(data.message || 'Failed to create team')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Cannot connect to server. Make sure backend is running on port 8080')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>Create a Team</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Start collaborating with your team members</p>
      
      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '5px', 
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '5px', 
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Team Name *</label>
          <input 
            type="text" 
            placeholder="Enter team name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '5px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }} 
            required 
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description (Optional)</label>
          <textarea 
            placeholder="Describe what your team does..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '5px', 
              border: '1px solid #ddd',
              minHeight: '100px',
              fontSize: '16px',
              resize: 'vertical'
            }} 
            rows="3" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: loading ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Want to join an existing team? <a href="/join-team" style={{ color: '#667eea' }}>Join Team</a>
      </p>
    </div>
  )
}

export default CreateTeam
