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
      const res = await fetch('http://localhost:8080/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() })
      })
      if (res.ok) {
        setMessage('✅ Joined team successfully!')
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        setMessage('❌ Invalid invite code')
      }
    } catch (err) {
      setMessage('❌ Error')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ color: '#667eea' }}>Join Team</h1>
      {message && <div style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Invite Code" value={inviteCode} onChange={e => setInviteCode(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px' }}>Join Team</button>
      </form>
    </div>
  )
}

export default JoinTeam
