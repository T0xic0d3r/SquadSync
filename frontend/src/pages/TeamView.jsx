import React, { useState, useEffect } from 'react'
import api from '../services/api'

function TeamView() {
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const teamRes = await api.get('/teams/my/')
      setTeam(teamRes.data)
      const membersRes = await api.get(`/teams/${teamRes.data.id}/members/`)
      setMembers(membersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Loading team...</div>

  if (!team) return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: 'white', borderRadius: '10px', textAlign: 'center' }}>
      <h2 style={{ color: '#667eea' }}>No Team Found</h2>
      <p>You are not in a team yet.</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <h1 style={{ color: '#667eea' }}>👥 {team.name}</h1>
        {team.description && <p style={{ color: '#666', marginBottom: '10px' }}>{team.description}</p>}
        <div style={{ backgroundColor: '#f8f9fa', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px', display: 'inline-block' }}>
          <strong>Invite Code: </strong>
          <span style={{ fontFamily: 'monospace', fontSize: '18px', letterSpacing: '3px', color: '#667eea' }}>{team.invite_code}</span>
        </div>
        <h3 style={{ marginBottom: '15px' }}>Members ({members.length})</h3>
        <div>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #dee2e6' }}>
              <div>
                <strong>{m.username}</strong>
                <span style={{ marginLeft: '10px', padding: '2px 8px', backgroundColor: m.role === 'ADMIN' ? '#667eea' : '#f8f9fa', color: m.role === 'ADMIN' ? 'white' : '#333', borderRadius: '10px', fontSize: '12px' }}>{m.role}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px', color: '#666' }}>
                <div>Score: <strong>{m.score}</strong></div>
                <div>Streak: <strong>{m.streak} days</strong></div>
                <div>Reliability: <strong>{m.reliability_score}%</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamView
