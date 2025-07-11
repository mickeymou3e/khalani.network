import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {}
export default function SideNav({ className }: Props) {
  return (
    <nav
      className={cn(
        "bg-[#1A1A1A]",
        "p-4",
        "px-8",
        "text-white",
        "flex",
        "flex-col",
        "items-center",
        "fixed",
        "top-0",
        "left-0",
        "bottom-0", // Ensure the sidebar stretches to the bottom of the viewport
        "w-[14rem]",
        className,
      )}
    >
      <h2>ezkl hub</h2>
      <Separator className="my-4 bg-[#5C5C5C]" />
      <ul className="flex h-72 flex-col justify-between pt-4">
        <li>
          <Link href="/">Overview</Link>
        </li>
        <li>
          <Link href="/artifacts">Artifacts</Link>
        </li>
        <li>
          <Link href="/organization">Organization</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li>
          <Link href="/Support">Support</Link>
        </li>
      </ul>
      <div className="mt-auto w-full">
        <Separator className="my-4 bg-[#5C5C5C]" />
        <div className="ml-2 flex items-center justify-start">
          <Badge className="mr-2 h-12 w-12 bg-[#D9D9D9]" />
          <p className="flex justify-center"></p>
        </div>
      </div>
    </nav>
  );
}
