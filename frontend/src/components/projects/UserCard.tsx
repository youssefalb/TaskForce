import React from 'react';
import { Avatar, Card, CardContent, Typography, Grid, Paper } from '@mui/material';




const UserCard = ({ user }: any) => {
 return (
    <div className="border border-gray-200 rounded-md p-4 shadow-lg">
      <div className="flex items-center">
        <div className="w-16 h-16">
          <img
            src={user.image}
            alt={user.username}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{user.username}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">Role: {user.role_name}</p>
        </div>
      </div>
    </div>
  );
};


export default UserCard;