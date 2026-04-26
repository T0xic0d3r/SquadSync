import React, { useState, useEffect } from 'react'

function TeamView() {
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.teamId) return

    const res = await fetch(`/api/teams/${user.teamId}/members/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setMembers(data)

    const teamRes = await fetch(`/api/teams/my/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const teamData = await teamRes.json()
    setTeam(teamData)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <h1 style={{ color: '#667eea' }}>👥 Team Members</h1>
        {team && <p><strong>Team:</strong> {team.name} &nbsp; <span style={{ color: '#999', fontSize: '14px' }}>Invite code: <strong>{team.invite_code}</strong></span></p>}
        <div style={{ marginTop: '20px' }}>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #dee2e6' }}>
              <div><strong>{m.name}</strong><br /><small>{m.email}</small></div>
              <div style={{ textAlign: 'right' }}>
                <div>Score: {m.score}</div>
                <div>Streak: {m.streak} days</div>
                <div>Reliability: {m.reliability_score}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamView
