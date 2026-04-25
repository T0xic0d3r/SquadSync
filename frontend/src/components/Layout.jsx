import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Dashboard, Leaderboard, Group, Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            SquadSync
          </Typography>
          
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            <Dashboard sx={{ mr: 1 }} /> Dashboard
          </Button>
          
          <Button color="inherit" onClick={() => navigate(`/team/${user?.teamId}`)}>
            <Group sx={{ mr: 1 }} /> Team
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/leaderboard')}>
            <Leaderboard sx={{ mr: 1 }} /> Leaderboard
          </Button>
          
          <IconButton onClick={handleMenu} sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: '#764ba2' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;