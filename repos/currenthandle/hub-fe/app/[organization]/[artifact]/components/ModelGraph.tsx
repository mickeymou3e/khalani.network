// ModelGraph.tsx
import dynamic from "next/dynamic";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {
  // model: Blob;
  modelUrl: string;
}

// Dynamic Import of DynamicModelGraph
const DynamicModelGraph = dynamic(() => import("./DynamicModelGraph"), {
  ssr: false,
});

export default function ModelGraph({ className, modelUrl }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "text-black",
            "hover:border-slate-600 hover:bg-gray-400",
            className,
          )}
        >
          Model Graph
        </Button>
      </DialogTrigger>
      <DynamicModelGraph
        modelUrl={modelUrl}
        className="min-h-[70vh] max-w-4xl"
      />
    </Dialog>
  );
}
