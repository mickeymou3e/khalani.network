// "use client";
import UserBadge from "../UserBadge";
import NavBar from "./NarBar";
import Notifications from "./Notifications";
// import { useSession } from "next-auth/react";

export default function Header() {
  // const { data: session, status } = useSession();

  return (
    <>
      <header className="w-screen bg-black p-4 px-6 pb-0">
        <div className="flex w-full items-center justify-between">
          <UserBadge />
          <div className="flex items-center">
            <Notifications />
            <UserSettings />
          </div>
        </div>
      </header>
      <NavBar />
    </>
  );
}

const UserSettings = () => (
  <div className="ml-2 h-7 w-7 rounded-full bg-gradient-to-br from-[#2fd55b] to-[#0f5ada]" />
);
