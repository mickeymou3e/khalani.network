import { getServerSession } from "next-auth";
import { Badge } from "./ui/badge";

export default async function UserBadge() {
  // const { data: session, status } = useSession();
  const session = await getServerSession();

  return (
    <div className="flex items-center justify-start bg-black">
      <Badge
        className="mr-6 aspect-square w-10 bg-[#D9D9D9] hover:bg-[#d9d9d9]"
        imageSrc={session?.user?.image || null}
      />
      <p className="flex justify-center text-2xl text-white">
        {session?.user?.name || ""}
      </p>
    </div>
  );
}
