import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '5px' }}>SquadSync</h1>
      <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px', color: '#555' }}>Welcome back</h2>
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px', marginBottom: '15px', color: '#721c24' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' }} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' }} required />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#aaa' : '#667eea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>No account? <Link to="/register" style={{ color: '#667eea' }}>Register</Link></p>
    </div>
  )
}

export default Login
