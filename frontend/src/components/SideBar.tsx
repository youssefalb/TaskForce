
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import { useEffect, useState } from "react";


export default function sideBar() {
    let { data: session } = useSession();
    const [profileImage, setProfileImage] = useState('');
    const [name, setName] = useState('');



    let menuItems = [
        {
            href: "/about",
            title: "About",
        },
        {
            href: "/contact",
            title: "Contact",
        }
    ]

    const fetchData = async () => {
        const Updatedsession = await getSession()
        session = Updatedsession;
        if (session?.user.image) {
        setProfileImage(session.user.image);
        setName(session.user.first_name + " " + session.user.last_name);
        console.log("Fetching data from side bar");
        console.log(session);
        }
    }

    useEffect(() => {
        fetchData()
    }, [session])

    
    return (
        <aside className="bg-gray-100 w-full md:w-60">
            {session ? (

                <Link href={"/settings"}>
                    <div className="flex items-center py-4 px-4 flex-col">
                        <ProfilePicture
                            src={profileImage}
                            alt={name}
                            size={5}
                        />
                        <div>
                            <h2 className="text-xs font-bold">{name}</h2>
                        </div>
                    </div>
                </Link>
            ) : null}
            <nav>
                <ul>
                    {menuItems.map(({ href, title }) => (
                        <li className="m-2" key={title}>
                            <Link href={href} passHref>
                                <div
                                    className="flex p-2 bg-gray-50 hover:bg-gray-200 cursor-pointer rounded-lg
                     "
                                >
                                    <span className="font-semibold text-gray-600 mx-6 text-sm">
                                        {title}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}