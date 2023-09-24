// components/AuthGuard.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect them away from login/register pages
    if (session) {
      router.push('/'); // Change '/dashboard' to the desired page
    }
  }, [session, router]);

  // Render children
  return <>{children}</>;
};

export default AuthGuard;
