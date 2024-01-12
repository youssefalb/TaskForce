import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { useSession } from 'next-auth/react';


export default function Layout({children}) {
  
  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ">
        <SideBar />
        <main className="flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}