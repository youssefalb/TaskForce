import React from 'react';

const Settings = ({ details }: any) => {
    
    console.log(details);
    return (
        <div>
            <h1>Settings</h1>
            <p>Project ID: {details?.id}</p>
            {details?.users && details?.users.map((userId: string) => (
                <li key={userId}>{userId}</li>
            ))}    

        </div>
    );
};

export default Settings;
