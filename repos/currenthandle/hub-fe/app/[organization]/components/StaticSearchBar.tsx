// "use server";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {}

export default function StaticSearchBar({ className }: Props) {
  return (
    <div>
      <SearchBar className={cn("w-full rounded-lg bg-black", className)} />
    </div>
  );
}
