import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';


const UserCard = ({ user, canBanUser, onBanUserClick }: any) => {
  const handleBanUserClick = () => {
    if (canBanUser) {
      // Handle the ban user here
      if (onBanUserClick) {
        onBanUserClick(user.id); // Pass the user ID to the parent component
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={user.username} src={user.image} sx={{ width: 50, height: 50 }} />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography noWrap variant="h6">{user.username}</Typography>
            <Typography noWrap color="text.secondary">{user.email}</Typography>
            <Typography noWrap color="text.secondary">Role: {user.role_name}</Typography>
          </Grid>
      {canBanUser && (
        <CardActions disableSpacing sx={{ justifyContent: 'flex-end', paddingRight: '16px' }}>
          <IconButton
            aria-label="ban user"
            onClick={() => handleBanUserClick()}
          >
            <img
              src="/images/ban-user.png"
              alt="Ban user"
              className='w-10 h-10'
            />
          </IconButton>
        </CardActions>
      )}
    </Grid>
  </CardContent>

    </Card>
  );
};

export default UserCard;
