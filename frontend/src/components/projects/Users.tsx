import { getProjectUsers } from '@/lib/projects';
import { Grid, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {

    fetchData()
  }, [projectId]);


const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(usernameSearchValue.toLowerCase())
  );

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
            <UserCard user={user} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default Users;