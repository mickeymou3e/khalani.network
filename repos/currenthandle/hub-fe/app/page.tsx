import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
// import AuthButtons from "@/components/AuthButtons";
import StaticAuthButtons from "@/components/StaticAuthButtons";

export default async function Home() {
  const ClientSearchBarWrapper = dynamic(
    () => import("@/components/AuthButtons"),
    {
      ssr: false,
      loading: () => <StaticAuthButtons />,
    },
  );
  const session = await getServerSession();

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
      <ClientSearchBarWrapper />

      <div className="mt-4 text-white">
        {session ? (
          <p>Signed in as {session.user?.name}</p>
        ) : (
          <p>Not signed in</p>
        )}
      </div>
    </div>
  );
}
