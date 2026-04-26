import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const TaskChat = ({ taskId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMessages();
  }, [taskId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/tasks/${taskId}/comments/`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post(`/tasks/${taskId}/comments/`, { content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading chat...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.length === 0
          ? <p style={{ textAlign: 'center', color: '#999' }}>No messages yet.</p>
          : messages.map(m => (
            <div key={m.id} style={{ marginBottom: '15px', display: 'flex', justifyContent: m.userId === user.id ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: '10px', backgroundColor: m.userId === user.id ? '#667eea' : '#f0f0f0', color: m.userId === user.id ? 'white' : '#333' }}>
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>{new Date(m.createdAt || m.created_at).toLocaleTimeString()}</div>
                <div>{m.content}</div>
              </div>
            </div>
          ))
        }
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
};

export default TaskChat;
