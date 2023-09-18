import React from 'react';
import { useSession } from 'next-auth/react';

function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        // User is logged in, display content for logged-in users
        <div>
          <h1>Welcome, {session.user?.email}!</h1>
          <p>{session.user?.role}</p>
        </div>
      ) : (
        <div>
          <h1>Welcome to our website!</h1>
          <p>Please log in to access more features.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
