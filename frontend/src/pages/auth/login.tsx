import CustomTextInput from '@/components/CustomTextInput';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import AuthGuard from '../../components/AuthGuard';

import Link from 'next/link';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const router = useRouter();


const handleLogin = async (e: any) => {
  e.preventDefault();
  
  try {
    const result = await signIn('credentials', {
      username: username,
      password: loginPassword,
      redirect: false,
    });
    console.log(result);
    if (result?.ok) {
        console.log('Login successful:', result);
        router.push('/');
      }

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const handleGoogleLogin = async (e: any) => {
  e.preventDefault();
  console.log('google login');
  try{
  const result = await signIn('google', {
    redirect: false,
  });
  if (result?.ok) {
    console.log('Login successful:', result);
    router.push('/');
  }
  }
  catch (error) {
    console.error('An error occurred:', error);
  }
}



  return (
    <AuthGuard>

    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-4 mt-1">We're happy to see you</h1>
        <p className="text-lg text-center font-bold">
          Login with ease.
        </p>
        <div className="bg-gray-50 flex glass p-10">
          <form onSubmit={handleLogin} className="max-h-96 shadow-md rainbow-mesh align-middle bg-white p-2 m-2 flex min-h-96 min-w-96 flex-grow flex-col rounded-xl">
            <p className="font-bold text-black text-2xl pt-8 pb-1 px-4">Username + Pass</p>
            <p className="font-normal text-black text-md pt-1 pb-8 px-4">Enter using your username & password</p>
            <CustomTextInput type="text" name="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <CustomTextInput type="password" name="password" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)} />
            <button type="submit" className="p-2 m-2 text-white font-bold rounded-2xl bg-gray-900">
              Login
            </button>

        <p className="text-gray-700">
            Don`t have an account? {''}
            <Link href="/auth/register" className="text-blue-500 underline">
            Register here
            </Link>
          </p>
          </form>
          
        
          <form  onSubmit={handleGoogleLogin} className="max-h-96 shadow-md rainbow-mesh align-middle bg-white p-2 m-2 flex min-h-96 min-w-96 flex-grow flex-col rounded-xl ml-72 mr-50">
            <p className="font-bold text-black text-2xl pt-8 pb-1 px-4">Even simpler?</p>
            <p className="font-normal text-black text-md pt-1 pb-8 px-4">One-click sign in with Google</p>
            <button type="submit" className="p-2 m-2 text-white font-bold bg-gray-900 rounded-2xl">
              Login with Google
            </button>
          </form>
        </div>

      
      </div>
    </div>
    </AuthGuard>
  );
};

export default Login;
