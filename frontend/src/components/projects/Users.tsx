import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { changeUserRole, getProjectUsers, removeUserFromProject, getUsers, addUserToProject } from '@/lib/projects';
import { Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import UserCard from './UserCard';
import EmptyStateMessage from '../EmptyStateMessage';
import LoadingComponent from '../LoadingComponent';
import UsersDialog from '../UsersDialog';

const Users = ({ projectId, projectRoles, permissions }: any) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [usernameSearchValue, setUsernameSearchValue] = useState('');
  const [openBanDialog, setOpenBanDialog] = useState(false);
  const [userToKick, setUserToKick] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canBanUser = permissions?.includes('delete_members');
  const canChangeRole = permissions?.includes('change_role');
  const canAddUser = permissions?.includes('add_members');
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const fetchData = async () => {
    if (session?.user?.accessToken && projectId) {
      try {
        setIsLoading(true);
        const data = await getProjectUsers(session.user.accessToken, projectId);
        const allUsersData = await getUsers(session.user.accessToken);
        setUsersList(allUsersData);
        setUsers(data);
        setIsLoading(false);

      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      console.error("Access token or projectId is undefined.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [session?.user?.accessToken, projectId]);


  if (isLoading) {
    return <LoadingComponent />;
  }


  if (users.length === 0) {
    return (
      <EmptyStateMessage
        title="No Users Found"
        description="No users found in this project."
      />
    );
  }

  const handleOpenBanDialog = (user) => {
    console.log('User to ban', user);
    setUserToKick(user);
    setOpenBanDialog(true);
  };


  const handleBanConfirmation = async () => {
    if (userToKick && session?.user?.accessToken && projectId) {
      try {
        await removeUserFromProject(session.user.accessToken, projectId, [userToKick.user]);
        setUsers(users.filter(u => u.id !== userToKick.id));
        console.log(`${userToKick.username} has been banned`);
      } catch (error) {
        console.error(error);
      }
    }
    setOpenBanDialog(false);
  };

  const handleAddUser = async (userId) => {
    console.log("user id to add: ", userId);
    if (session?.user?.accessToken && projectId) {
      try {
        await addUserToProject(session.user.accessToken, projectId, [userId]);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(usernameSearchValue.toLowerCase())
  );



  const handleRoleChange = async (roleId, newRoleId) => {
    try {
      if (session?.user?.accessToken && projectId) {
        await changeUserRole(session.user.accessToken, roleId, newRoleId);
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.id === roleId) {
              return { ...user, role: projectRoles.find((role) => role.id === newRoleId) };
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

      {canAddUser && (<button onClick={() => setShowUsersDialog(true)} className="p-2 m-2 text-black font-bold bg-zinc-300 rounded-2xl">
        + Add Project Member
      </button>)}

      <Grid container spacing={2}>
        {filteredUsers.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
            <UserCard
              user={user}
              canBanUser={canBanUser}
              onChangeUserRole={handleRoleChange}
              availableRoles={projectRoles}
              onBanUserClick={() => handleOpenBanDialog(user)}
              canChangeRole={canChangeRole}
            />
          </Grid>
        ))}
      </Grid>

      <UsersDialog
        open={showUsersDialog}
        onClose={() => setShowUsersDialog(false)}
        onAdd={handleAddUser}
        usersList={usersList}
      />

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
