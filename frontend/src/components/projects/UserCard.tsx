import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const UserCard = ({ user, canBanUser, onBanUserClick, onChangeUserRole, availableRoles, canChangeRole }: any) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  console.log('availableRoles', availableRoles)

  const handleBanUserClick = () => {
    if (canBanUser && onBanUserClick) {
      onBanUserClick(user.id);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (newRole) => {
    onChangeUserRole(user.id, newRole);
    handleClose();
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
        </Grid>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'flex-end', paddingRight: '16px' }}>
        {canBanUser && (
          <IconButton
            aria-label="ban user"
            onClick={handleBanUserClick}
          >
            <img
              src="/images/ban-user.png"
              alt="Ban user"
              className='w-10 h-10'
            />
          </IconButton>
        )}

        {canChangeRole && (
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <img
              src="/images/more.png"
              alt="More options"
              className='w-8 h-8'
            />
          </IconButton>
        )}

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
        >
          {availableRoles?.map((role) => (
            <MenuItem key={role.id} onClick={() => handleRoleChange(role.id)}>
              {role.name}
            </MenuItem>
          ))}
        </Menu>
      </CardActions>
    </Card>
  );
};

export default UserCard;
