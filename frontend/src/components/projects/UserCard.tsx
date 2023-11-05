import React from 'react';

const UserCard = ({ user, canBanUser, onBanUserClick }: any) => {
  const handleBanUserClick = () => {
    if (canBanUser) {
      // Handle the ban user action here
      if (onBanUserClick) {
        onBanUserClick(user.id); // Pass the user ID or relevant data to the parent component
      }
    }
  };

  console.log('User ID', user.id);
  console.log('User', user);
  console.log('Can Ban User', canBanUser);

  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-lg flex">
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
        {canBanUser && (
            <div className="left-0 flex">
           <img
              src="/images/ban-user.png"
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover align-right"
              onClick={() => handleBanUserClick()}
            />
            </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
