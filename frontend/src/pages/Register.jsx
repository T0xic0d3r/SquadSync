import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Step 1: register
      const regRes = await fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const regData = await regRes.json()
      if (!regRes.ok) {
        const msg = Object.values(regData).flat().join(' ')
        setError(msg || 'Registration failed')
        return
      }

      // Step 2: auto login
      const tokenRes = await fetch('/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const tokenData = await tokenRes.json()
      if (!tokenRes.ok) {
        setError('Registered but could not log in. Please go to login.')
        return
      }
      localStorage.setItem('token', tokenData.access)
      localStorage.setItem('refresh', tokenData.refresh)

      // Step 3: get full user info including teamId
      const userRes = await fetch('/api/me/', {
        headers: { 'Authorization': `Bearer ${tokenData.access}` }
      })
      const user = await userRes.json()
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err) {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '5px' }}>SquadSync</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px' }}>Create your account</p>
      {error && <div style={{ padding: '12px', backgroundColor: '#f8d7da', borderRadius: '8px', marginBottom: '15px', color: '#721c24', fontSize: '14px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username (min 3 characters)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '13px', marginTop: '10px', backgroundColor: loading ? '#aaa' : '#764ba2', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Have an account? <Link to="/login" style={{ color: '#667eea' }}>Login</Link>
      </p>
    </div>
  )
}

export default Register
