import { getProjectUsers } from '@/lib/projects';
import { Grid, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { use, useEffect, useState } from 'react';
import UserCard from './UserCard';

const Users = ({ projectId }: any) => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [usernameSearchValue, setUsernameSearchValue] = useState('');


  const fetchData = async () => {
    if (session?.user?.accessToken && projectId) {
      await getProjectUsers(session.user.accessToken, projectId)
        .then((data) => { setUsers(data); console.log('Response Data', data); })
        .catch((error) => console.error(error));
    } else {
      console.error("Access token or user ID is undefined.");
    }
  }
  const checkPermissionsForBan = () => {
    const user = users.find((user) => user.user === session?.user?.id);
    const hasAddMemberPermission = user.role.permissions.some(permission => permission.codename === 'add_members');
    return hasAddMemberPermission;
  }

  useEffect(() => {

    fetchData()
  }, [projectId]);



const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(usernameSearchValue.toLowerCase())
  );


  const handleBanUserClick = (userId) => {

    console.log('User ID');
  };


  return (
    <div>
      <div className="mb-10">
      <TextField
        label="Search by Username"
        variant="outlined"
        onChange={(e : any) => setUsernameSearchValue(e.target.value)}
        className="w-full p-2 m-10"
      />
      </div>
      <Grid container spacing={2}>
        {filteredUsers.map((user) => (
          <Grid item key={user.username} xs={12} sm={6} md={4} lg={3}>
        <UserCard
          user={user}
          canBanUser={checkPermissionsForBan()} 
          onBanUserClick={handleBanUserClick} // Pass the ban user action function
        />        
        
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default Users;