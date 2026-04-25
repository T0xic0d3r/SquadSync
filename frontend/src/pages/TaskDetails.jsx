import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function TaskDetails() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [proofType, setProofType] = useState('image')
  const [proofFile, setProofFile] = useState(null)
  const [proofLink, setProofLink] = useState('')
  const [caption, setCaption] = useState('')
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTask()
    fetchComments()
  }, [id])

  const fetchTask = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setTask(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching task:', err)
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setComments(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
    }
  }

  const handleSubmitProof = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('type', proofType)
    formData.append('caption', caption)
    
    if (proofType === 'link') {
      formData.append('link', proofLink)
    } else if (proofFile) {
      formData.append('file', proofFile)
    }

    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}/proof`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      if (res.ok) {
        setMessage('✅ Proof submitted! Waiting for approval.')
        setTimeout(() => fetchTask(), 1000)
      } else {
        setMessage('❌ Failed to submit proof')
      }
    } catch (err) {
      setMessage('❌ Error submitting proof')
    }
  }

  const handleApprove = async (approved, reason = '') => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved, reason })
      })
      if (res.ok) {
        setMessage(approved ? '✅ Task approved! Points awarded!' : '❌ Task rejected')
        setTimeout(() => fetchTask(), 1000)
      }
    } catch (err) {
      setMessage('Error processing request')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      })
      if (res.ok) {
        setNewComment('')
        fetchComments()
      }
    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading task details...</div>
  }

  if (!task) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Task not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    )
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isCreator = task.assignedBy === user.id
  const isAssignee = task.assignedTo === user.id
  const canApprove = isCreator && task.status === 'SUBMITTED'
  const canSubmit = isAssignee && task.status === 'PENDING'

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        ← Back to Dashboard
      </button>
      
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px', marginBottom: '20px' }}>
        <h1 style={{ color: '#667eea', marginBottom: '15px' }}>{task.title}</h1>
        <p style={{ color: '#666', lineHeight: '1.6' }}>{task.description || 'No description provided'}</p>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <p><strong>📅 Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : 'Not set'}</p>
          <p><strong>👤 Assigned to:</strong> {task.assignedUser?.name || 'Unknown'}</p>
          <p><strong>📊 Status:</strong> 
            <span style={{ 
              marginLeft: '10px',
              padding: '3px 10px', 
              borderRadius: '5px',
              backgroundColor: task.status === 'APPROVED' ? '#d4edda' : task.status === 'SUBMITTED' ? '#fff3cd' : '#f8d7da',
              color: task.status === 'APPROVED' ? '#155724' : task.status === 'SUBMITTED' ? '#856404' : '#721c24'
            }}>
              {task.status}
            </span>
          </p>
          {task.score && <p><strong>🏆 Points:</strong> +{task.score}</p>}
          {task.penalty && <p><strong>⚠️ Penalty:</strong> {task.penalty}</p>}
        </div>

        {task.proof && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '10px' }}>📎 Proof Submitted:</h3>
            {task.proof.type === 'image' && (
              <img src={task.proof.url} alt="Proof" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
            )}
            {task.proof.type === 'link' && (
              <a href={task.proof.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                {task.proof.url}
              </a>
            )}
            {task.proof.caption && <p style={{ marginTop: '10px', fontStyle: 'italic' }}>{task.proof.caption}</p>}
            {task.proof.status === 'REJECTED' && task.proof.rejectionReason && (
              <div style={{ backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                <strong>Rejection reason:</strong> {task.proof.rejectionReason}
              </div>
            )}
          </div>
        )}

        {canSubmit && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>Submit Proof of Completion</h3>
            {message && (
              <div style={{ 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '5px', 
                backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
                color: message.includes('✅') ? '#155724' : '#721c24'
              }}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmitProof}>
              <select 
                value={proofType} 
                onChange={e => setProofType(e.target.value)} 
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value="image">📷 Photo/Screenshot</option>
                <option value="file">📄 Document/File</option>
                <option value="link">🔗 Link/URL</option>
              </select>
              
              {proofType === 'link' ? (
                <input 
                  type="url" 
                  placeholder="https://example.com/proof" 
                  value={proofLink} 
                  onChange={e => setProofLink(e.target.value)} 
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} 
                  required 
                />
              ) : (
                <input 
                  type="file" 
                  onChange={e => setProofFile(e.target.files[0])} 
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
                  required 
                />
              )}
              
              <textarea 
                placeholder="Add a caption or notes (optional)" 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }} 
                rows="2" 
              />
              
              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Submit Proof
              </button>
            </form>
          </div>
        )}

        {canApprove && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handleApprove(true)} 
              style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              ✅ Approve Task
            </button>
            <button 
              onClick={() => {
                const reason = prompt('Please enter a reason for rejection:')
                if (reason) handleApprove(false, reason)
              }} 
              style={{ flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              ❌ Reject Task
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>💬 Discussion ({comments.length})</h3>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
          {comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No comments yet. Start the discussion!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ color: '#667eea' }}>{comment.user?.name || 'Unknown'}</strong>
                  <small style={{ color: '#999' }}>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
                <p style={{ margin: '5px 0 0 0', lineHeight: '1.5' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)} 
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} 
            required 
          />
          <button 
            type="submit" 
            style={{ padding: '12px 24px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default TaskDetails
