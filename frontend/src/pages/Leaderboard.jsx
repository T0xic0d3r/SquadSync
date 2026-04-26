import React, { useState, useEffect } from 'react'
import api from '../services/api'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [sortBy, setSortBy] = useState('score')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/teams/leaderboard?sort=${sortBy}`)
      .then(res => setLeaderboard(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sortBy])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center', marginBottom: '20px' }}>🏆 Leaderboard</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          {['score', 'reliability', 'streak'].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{ padding: '10px 20px', backgroundColor: sortBy === s ? '#667eea' : '#f8f9fa', color: sortBy === s ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {s === 'score' ? '🏅 Top Scorers' : s === 'reliability' ? '💯 Most Reliable' : '🔥 Best Streaks'}
            </button>
          ))}
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
        ) : leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '30px' }}>No data yet. Complete tasks to appear here!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Rank</th>
                <th style={{ textAlign: 'left' }}>Member</th>
                <th style={{ textAlign: 'right', padding: '15px' }}>
                  {sortBy === 'score' ? 'Score' : sortBy === 'reliability' ? 'Reliability' : 'Streak'}
                </th>
                <th style={{ textAlign: 'right', padding: '15px' }}>Tasks Done</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, i) => (
                <tr key={u.userId} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '15px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</td>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: sortBy === 'score' ? '#28a745' : sortBy === 'reliability' ? '#17a2b8' : '#fd7e14' }}>
                    {sortBy === 'score' && `${u.score} pts`}
                    {sortBy === 'reliability' && `${u.reliabilityScore}%`}
                    {sortBy === 'streak' && `${u.streak} days`}
                  </td>
                  <td style={{ textAlign: 'right', padding: '15px' }}>{u.completedTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
