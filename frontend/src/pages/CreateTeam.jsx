import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateTeam() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/teams/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      })
      const data = await res.json()
      if (res.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({ ...user, teamId: data.id }))
        setMessage('✅ Team created! Invite code: ' + data.invite_code)
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setMessage('❌ ' + JSON.stringify(data))
      }
    } catch (err) {
      setMessage('❌ Cannot connect to server')
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>Create a Team</h1>
      {message && (
        <div style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Team Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter team name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description (Optional)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this team about?" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
          Create Team
        </button>
      </form>
    </div>
  )
}

export default CreateTeam
