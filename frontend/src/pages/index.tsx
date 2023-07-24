import Head from 'next/head';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function Home() {
  return (
    <div>
      <Head>
        <title>TaskForce</title>
      </Head>

      <Box sx={{ backgroundColor: '#3f51b5', color: 'white', py: 8 }}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Welcome to TaskForce
          </Typography>
          <Typography variant="body1" align="center">
            Manage your team, projects and tasks all in one place.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="sm" align="center">
          <Typography variant="body1">
            Ready to get started?
          </Typography>
          <Button href="#" variant="contained" color="primary" sx={{ mt: 4 }}>
            Get Started
          </Button>
        </Container>
      </Box>

    </div>
  );
}
