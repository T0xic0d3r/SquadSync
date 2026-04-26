import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinTeam() {
  const [inviteCode, setInviteCode] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/teams/join/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ invite_code: inviteCode.toUpperCase() })
      })
      const data = await res.json()
      if (res.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({ ...user, teamId: data.id }))
        setMessage('✅ Joined team: ' + data.name)
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setMessage('❌ ' + (data.error || 'Invalid invite code'))
      }
    } catch (err) {
      setMessage('❌ Cannot connect to server')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>Join a Team</h1>
      {message && (
        <div style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Invite Code *</label>
          <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Enter 8-character invite code" maxLength={8} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '18px' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
          Join Team
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={() => navigate('/create-team')}>Create a new team instead →</span>
      </p>
    </div>
  )
}

export default JoinTeam
