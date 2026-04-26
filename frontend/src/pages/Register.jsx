import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        // Auto-login after register
        const tokenRes = await fetch('/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        const tokenData = await tokenRes.json()
        if (tokenRes.ok) {
          localStorage.setItem('token', tokenData.access)
          localStorage.setItem('refresh', tokenData.refresh)
          localStorage.setItem('user', JSON.stringify(data))
          navigate('/dashboard')
        }
      } else {
        const msg = Object.values(data).flat().join(' ')
        setError(msg || 'Registration failed')
      }
    } catch (err) {
      setError('Cannot connect to server')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', color: '#667eea' }}>SquadSync</h1>
      <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>Register</h2>
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px', marginBottom: '10px', color: '#721c24' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#764ba2', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>Have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register
