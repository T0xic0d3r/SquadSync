import React from 'react'

const priorityColor = { LOW: '#28a745', MEDIUM: '#ffc107', HIGH: '#dc3545' }
const statusColor = { TODO: '#6c757d', IN_PROGRESS: '#0d6efd', DONE: '#28a745' }

function TaskCard({ task, onClick, onStatusChange }) {
  return (
    <div onClick={onClick} style={{ padding: '15px 20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '10px', cursor: onClick ? 'pointer' : 'default', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>{task.title}</div>
        {task.description && <div style={{ color: '#666', fontSize: '13px', marginBottom: '6px' }}>{task.description.slice(0, 80)}{task.description.length > 80 ? '...' : ''}</div>}
        {task.deadline && <div style={{ fontSize: '12px', color: '#999' }}>📅 {new Date(task.deadline).toLocaleDateString()}</div>}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '15px' }}>
        <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px', backgroundColor: priorityColor[task.priority] || '#6c757d', color: 'white' }}>{task.priority}</span>
        <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '12px', backgroundColor: statusColor[task.status] || '#6c757d', color: 'white' }}>{task.status?.replace('_', ' ')}</span>
      </div>
    </div>
  )
}

export default TaskCard
