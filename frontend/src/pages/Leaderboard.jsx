import React, { useState, useEffect } from 'react'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:8000/api/leaderboard?sort=${sortBy}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setLeaderboard)
  }, [sortBy])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center' }}>🏆 Leaderboard</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button onClick={() => setSortBy('score')} style={{ padding: '10px 20px', backgroundColor: sortBy === 'score' ? '#667eea' : '#f8f9fa', color: sortBy === 'score' ? 'white' : '#333', border: 'none', borderRadius: '5px' }}>Top Scorers</button>
          <button onClick={() => setSortBy('reliability')} style={{ padding: '10px 20px', backgroundColor: sortBy === 'reliability' ? '#667eea' : '#f8f9fa', color: sortBy === 'reliability' ? 'white' : '#333', border: 'none', borderRadius: '5px' }}>Most Reliable</button>
          <button onClick={() => setSortBy('streak')} style={{ padding: '10px 20px', backgroundColor: sortBy === 'streak' ? '#667eea' : '#f8f9fa', color: sortBy === 'streak' ? 'white' : '#333', border: 'none', borderRadius: '5px' }}>Best Streaks</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th style={{ padding: '15px' }}>Rank</th><th>Member</th><th style={{ textAlign: 'right' }}>Score/Reliability/Streak</th><th style={{ textAlign: 'right' }}>Tasks</th>
          </tr></thead>
          <tbody>
            {leaderboard.map((u, i) => (
              <tr key={u.userId} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '15px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</td>
                <td><strong>{u.name}</strong></td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: sortBy === 'score' ? '#28a745' : sortBy === 'reliability' ? '#17a2b8' : '#fd7e14' }}>
                  {sortBy === 'score' && `${u.score} pts`}
                  {sortBy === 'reliability' && `${u.reliabilityScore}%`}
                  {sortBy === 'streak' && `${u.streak} days`}
                </td>
                <td style={{ textAlign: 'right' }}>{u.completedTasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leaderboard
