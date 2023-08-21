
import Link from "next/link";


export default function sideBar() {

    let menuItems = [
        {
            href: "/about",
            title: "About",
        },
        {
            href: "/contact",
            title: "Contact",
        },
        {
            href: "/locations",
            title: "Find Us",
        },
    ]

    return (
        <aside className="bg-gray-100 w-full md:w-60">
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