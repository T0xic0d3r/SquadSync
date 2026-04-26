import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateTeam() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/teams/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description })
      })
      const data = await res.json()
      if (res.ok) {
        // Refresh user in localStorage to get updated teamId
        const userRes = await fetch('/api/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const user = await userRes.json()
        localStorage.setItem('user', JSON.stringify(user))
        setMessage(`✅ Team created! Invite code: ${data.invite_code}`)
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        const msg = data.detail || data.error || Object.values(data).flat().join(' ')
        setMessage('❌ ' + msg)
      }
    } catch (err) {
      setMessage('❌ Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <h1 style={{ color: '#667eea', textAlign: 'center', marginBottom: '5px' }}>Create a Team</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px' }}>Start a squad and invite members</p>
      {message && (
        <div style={{ padding: '12px', margin: '10px 0', borderRadius: '8px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24', fontSize: '14px' }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#444' }}>Team Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Alpha Squad"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#444' }}>Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What is this team about?"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', boxSizing: 'border-box', fontSize: '15px', resize: 'vertical' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#aaa' : '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
        Already have a code?{' '}
        <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={() => navigate('/join-team')}>
          Join a team instead →
        </span>
      </p>
    </div>
  )
}

export default CreateTeam
