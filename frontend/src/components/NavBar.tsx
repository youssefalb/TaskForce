import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';

export default function navBar() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session } = useSession();

    return (
        <header className="bg-gray-800 top-0 flex justify-between items-center font-semibold border-b ">
            <div className="ml-8 w-52">
                <a href="/">
                    <img src="/images/logo-no-background.png" alt=""></img>
                </a>
            </div>

            <div className="mr-10 items-center">
                {session ? (
                    <div>
                        <Link href="/">
                            <button onClick={() => signOut()}
                                className="px-8 py-1 text-gray-900 bg-zinc-300 rounded-2xl mr-2 my-3 font-bold">
                                Logout
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link href="/auth/login">
                            <button className="px-8 py-1 text-gray-900 bg-zinc-300 rounded-2xl mr-2 my-3 font-bold">
                                Login
                            </button>
                        </Link>
                        <Link href="/auth/register">
                            <button className="px-8 py-1 text-gray-900 bg-zinc-300 rounded-2xl mr-2 my-3 font-bold">
                                Register
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
