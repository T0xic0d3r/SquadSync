import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Cannot connect to server')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', color: '#667eea' }}>SquadSync</h1>
      <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>Login</h2>
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px', marginBottom: '10px', color: '#721c24' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login
