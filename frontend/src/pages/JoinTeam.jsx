import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinTeam() {
  const [inviteCode, setInviteCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/teams/join/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ invite_code: inviteCode.toUpperCase() })
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh user in localStorage to get updated teamId
        const userRes = await fetch('/api/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const user = await userRes.json()
        localStorage.setItem('user', JSON.stringify(user))
        setMessage('✅ Joined team: ' + data.name)
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setMessage('❌ ' + (data.error || 'Invalid invite code'))
      }
    } catch (err) {
      setMessage('❌ Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center', marginBottom: '5px' }}>Join a Team</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px' }}>Enter your invite code below</p>
      {message && (
        <div style={{ padding: '12px', margin: '10px 0', borderRadius: '8px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24', fontSize: '14px' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#444' }}>Invite Code *</label>
          <input
            type="text"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            placeholder="e.g. AB12CD34"
            maxLength={8}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '2px solid #ddd', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '20px', textAlign: 'center' }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#aaa' : '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Joining...' : 'Join Team'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
        <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={() => navigate('/create-team')}>
          Create a new team instead →
        </span>
      </p>
    </div>
  )
}

export default JoinTeam
