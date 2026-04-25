import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Avatar, Typography, Paper, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const TaskChat = ({ taskId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:8080', {
      auth: { token }
    });
    setSocket(newSocket);
    
    newSocket.emit('join-task', taskId);
    newSocket.on('new-comment', (comment) => {
      if (comment.taskId === taskId) {
        setMessages(prev => [...prev, comment]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { content: newMessage });
      socket?.emit('send-comment', response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, maxHeight: '400px' }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ display: 'flex', mb: 2, justifyContent: message.userId === user?.id ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1, maxWidth: '70%' }}>
              {message.userId !== user?.id && <Avatar sx={{ width: 32, height: 32 }}>{message.user?.name?.charAt(0) || 'U'}</Avatar>}
              <Paper sx={{ p: 1.5, bgcolor: message.userId === user?.id ? '#667eea' : '#f5f5f5', color: message.userId === user?.id ? 'white' : 'text.primary', borderRadius: 2 }}>
                <Typography variant="caption" display="block" sx={{ mb: 0.5, opacity: 0.7 }}>{format(new Date(message.createdAt), 'HH:mm')}</Typography>
                <Typography variant="body2">{message.content}</Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
        <TextField fullWidth multiline maxRows={3} placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} size="small" />
        <IconButton onClick={handleSend} color="primary"><Send /></IconButton>
      </Box>
    </Box>
  );
};

export default TaskChat;