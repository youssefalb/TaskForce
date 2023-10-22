import React from 'react';

const Users = ({ users }: any) => {
  return (
    <div>
        {users && users.map((userId: string) => (
          <li key={userId}>{userId}</li>
        ))}
    </div>
  );
};

export default Users;
