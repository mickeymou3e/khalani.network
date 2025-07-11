// "use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props extends React.HTMLAttributes<HTMLElement> {}
export default function AuthButtons({ className }: Props) {
  return (
    <div className={cn("mt-4 flex space-x-4", className)}>
      <Button>Sign in</Button>
      <Button>Sign out</Button>
    </div>
  );
}
