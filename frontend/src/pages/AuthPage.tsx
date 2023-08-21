import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  return (
    <Container maxWidth="md">
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#222', color: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <TextField
              type="email"
              label="Email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ backgroundColor: '#333', borderRadius: '4px' }}
            />
            <TextField
              type="password"
              label="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ backgroundColor: '#333', borderRadius: '4px' }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#444', marginTop: '1rem' }}>
              Login
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#fff', color: '#222' }}>
            <Typography variant="h4" gutterBottom>
              Register
            </Typography>
            <TextField
              type="email"
              label="Email"
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}
            />
            <TextField
              type="password"
              label="Password"
              value={registerPassword}
              onChange={e => setRegisterPassword(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#ddd', marginTop: '1rem' }}>
              Register
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
