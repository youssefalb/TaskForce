import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { changeUserRole, getProjectUsers, removeUserFromProject } from '@/lib/projects';
import { Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import UserCard from './UserCard';

const Users = ({ projectId, projectRoles }: any) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [usernameSearchValue, setUsernameSearchValue] = useState('');
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [userToKick, setUserToKick] = useState(null);
    const fetchData = async () => {
      if (session?.user?.accessToken && projectId) {
        try {
          const data = await getProjectUsers(session.user.accessToken, projectId);
          setUsers(data);
          console.log('Response Data', data);
          console.log('Project Roles', projectRoles);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("Access token or projectId is undefined.");
      }
    };
    
    useEffect(() => {
    fetchData();
  }, [session?.user?.accessToken, projectId]);

  const checkPermissionsForBan = () => {
    const user = users.find((user) => user.user === session?.user?.id);
    return user?.role?.permissions?.some(permission => permission.codename === 'delete_members');
  };

  const handleOpenBanDialog = (user) => {
    console.log('User to ban', user);
    setUserToKick(user);
    setOpenBanDialog(true);
  };

  const handleBanConfirmation = async () => {
    if (userToKick && session?.user?.accessToken && projectId) {
      try {
        await removeUserFromProject(session.user.accessToken, projectId, [userToKick.user]);
        // Remove the banned user from the state as well
        setUsers(users.filter(u => u.id !== userToKick.id));
        console.log(`${userToKick.username} has been banned`);
      } catch (error) {
        console.error(error);
      }
    }
    setOpenBanDialog(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(usernameSearchValue.toLowerCase())
  );



  const handleRoleChange = async (roleId, newRoleId) => {
    try {
      if (session?.user?.accessToken && projectId) {
        await changeUserRole(session.user.accessToken, roleId ,newRoleId);
        setUsers((prevUsers) => 
        prevUsers.map((user) => {
          if (user.id === roleId) { 
            return { ...user, role: projectRoles.find((role) => role.id === newRoleId) }; // Updating the role object with new role details
          }
          return user;
        })
      );
      fetchData();
      }
    }
    catch (error) {
      console.error(error);
    }
};

  return (
    <div>
      <div className="mb-10">
        <TextField
          label="Search by Username"
          variant="outlined"
          onChange={(e) => setUsernameSearchValue(e.target.value)}
          className="w-full p-2 m-10"
        />
      </div>
      <button className="p-2 m-2 text-black font-bold bg-zinc-300 rounded-2xl">
        + Add Project Member
      </button>
      <Grid container spacing={2}>
        {filteredUsers.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
            <UserCard
              user={user}
              canBanUser={checkPermissionsForBan()}
              onChangeUserRole={handleRoleChange}
              availableRoles = {projectRoles}
              onBanUserClick={() => handleOpenBanDialog(user)}
            />
          </Grid>
        ))}
      </Grid>


      <Dialog open={openBanDialog} onClose={() => setOpenBanDialog(false)}>
        <DialogTitle>{"Confirm Ban"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to ban ${userToKick?.username}? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBanDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBanConfirmation} color="primary" autoFocus>
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
