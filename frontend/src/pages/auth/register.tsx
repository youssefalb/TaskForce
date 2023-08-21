//create a register page
import { useState } from 'react';
import CustomTextInput from '../../components/CustomTextInput';
import React from 'react';


export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFname] = useState('');
    const [lastName, setLname] = useState('');

    

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold text-center mb-4 mt-1">Welcome to TaskForce!</h1>
                <p className="text-lg text-center">
                    Please, provide us with all the necessary data to proceed.
                </p>
                <div className='flex items-center justify-center mt-10 '>
                    <form className='shadow-md p-6 bg-white m-2 flex flex-col rounded-xl justify-center'>
                        <div className='grid grid-cols-2 gap'>
                            <CustomTextInput type='text' name='fname' placeholder='First name' onChange={(e) => setFname(e.target.value)} />
                            <CustomTextInput type='text' name='lname' placeholder='Last name' onChange={(e) => setLname(e.target.value)} />
                            <CustomTextInput type='email' name='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                            <CustomTextInput type='password' name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button
                            type='submit'
                            className='p-2 mt-5 m-2 text-white font-bold bg-gray-900 rounded-2xl'
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};  