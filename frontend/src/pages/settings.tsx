import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import CustomButton from "../components/CustomButton";
import { useSession } from "next-auth/react";
import { getUserData, updateUserData } from "@/lib/userData";


const UserSettings = () => {
    const { data: session, update } = useSession();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [image, setImage] = useState('');

    const handlePictureChange = (e:any) => {
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Submitted");
        console.log(session);

    };

    const updateData = async (e: any) => {
        e.preventDefault();
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            image: image,
        }
        try {
            const response = await updateUserData(session?.user?.accessToken as string, userData);
        }
        catch (e) {
            console.log(e);
        }
        if (session?.user) {
            // Create a copy of the session.user object
            const updatedUser = { ...session.user };
            updatedUser.first_name = firstName;
            updatedUser.last_name = lastName;
            updatedUser.email = email;
            updatedUser.image = image;

            const updatedSession = { ...session, user: updatedUser };
            session.user = updatedSession.user;
            update(updatedSession);

            console.log("After session Update", session);
        }
    }

    const fetchData = async () => {
        console.log("Fetching data");
        console.log(session);
        const userData = await getUserData(session?.user?.accessToken as string);
        setImage(userData?.image);
        setFirstName(userData?.first_name);
        setLastName(userData?.last_name);
        setEmail(userData?.email);
    }


    useEffect(() => {
        fetchData()
    }, [session])

    const sendVerificationEmail = async () => {
    }

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
                        src={image}
                        alt={session?.user?.username}
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
                    <form onSubmit={updateData}>
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
                    <form onSubmit={updateData}>
                        <div className="my-10">
                            <TextField
                                fullWidth
                                required
                                label="Email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        {session?.user?.emailVerified ? (
                            <span className="text-green-500 flex my-2">
                                Email verified
                            </span>
                        ) : (
                            <>
                                <span className="text-red-500 flex my-2">
                                    Email not verified
                                </span>
                                <CustomButton buttonText={"Verify Email"} color="gray" onClick={() => {sendVerificationEmail()}} />
                            </>
                        )}
                        <CustomButton buttonText={"Save Email"} color="gray" />
                        </div>
                    </form>
                </div>


                {session?.user?.provider == "credentials" ? (
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
                        <CustomButton buttonText={"Save Password"} color="gray" />
                    </form>
                </div>

                ) : null}
     
            </div>
        </div>
    );
};

export default UserSettings;
