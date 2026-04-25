import React from 'react'
import { useNavigate } from 'react-router-dom'

function TaskCard({ task }) {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return '#28a745'
      case 'REJECTED': return '#dc3545'
      case 'SUBMITTED': return '#ffc107'
      default: return '#6c757d'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'URGENT': return '#dc3545'
      case 'HIGH': return '#fd7e14'
      case 'MEDIUM': return '#ffc107'
      default: return '#28a745'
    }
  }

  return (
    <div onClick={() => navigate(`/task/${task.id}`)} style={{
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{task.title}</h4>
        <div>
          <span style={{ backgroundColor: getPriorityColor(task.priority), color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', marginRight: '5px' }}>
            {task.priority}
          </span>
          <span style={{ backgroundColor: getStatusColor(task.status), color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '12px' }}>
            {task.status}
          </span>
        </div>
      </div>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>{task.description?.substring(0, 100)}</p>
      <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>Due: {new Date(task.deadline).toLocaleDateString()}</p>
    </div>
  )
}

export default TaskCard
