import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import CustomButton from "../components/CustomButton";
import { useSession } from "next-auth/react";
import {getUserData} from "@/lib/userData";


const UserSettings = () => {
    const { data: session } = useSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const handlePictureChange = (e) => {
        // Placeholder for handling picture change
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted");
        console.log(session);

    };

    const fetchData = async () => {
        console.log("Fetching data");

        const userData = await getUserData(session?.user?.accessToken);
        setFirstName(userData?.firstName);
        setLastName(userData?.lastName);
        setEmail(userData?.email);
    }


    useEffect(() => {
        fetchData()
    }, [session])

    return (
        <div>
            <div className="relative">
                <img
                    src="https://picsum.photos/900"
                    alt="Cover"
                    className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>
            <div className="relative mx-auto -mt-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white hover:cursor-pointer">
                <label htmlFor="profileImageInput" className="w-full h-full">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureChange}
                    />
                </label>
            </div>
            <div className="mx-auto max-w-screen-lg my-8 px-4">
                <div className="text-center"> 
                    <form onSubmit={handleSubmit}>
                        <div className="my-6">
                            <TextField
                                fullWidth
                                required
                                label="First Name"
                                value={firstName}
                                type="text"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                fullWidth
                                required
                                label="Last Name"
                                value={lastName}
                                type="text"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <CustomButton buttonText={"Save Changes"} color="gray" />
                    </form>
                </div>
                <div className="text-center"> 
                    <form onSubmit={handleSubmit}>
                        <div className="my-10">
                            <TextField
                                fullWidth
                                required
                                label="Email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="text-red-500 flex my-2">
                                Email not verified
                            </span>
                            <CustomButton buttonText={"Save Email"} color="gray" />
                        </div>
                    </form>
                </div>
                <div className="text-center"> 
                    <form onSubmit={handleSubmit}>
                        <div className="mt-10 mb-4">
                            <TextField
                                fullWidth
                                label="Old Password"
                                value={oldPassword}
                                type="password"
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                fullWidth
                                required
                                label="New Password"
                                value={newPassword}
                                type="password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <CustomButton buttonText={"Save Password"} color="gray"/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
