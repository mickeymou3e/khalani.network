"use client";
// DynamicModelGraph.tsx
// @ts-ignore
import ReactOnnx, { useOnnx } from "@wolanx/react-netron";
import { DialogContent } from "@/components/ui/dialog";

interface DynamicModelGraphProps extends React.HTMLAttributes<HTMLElement> {
  // model: Blob;
  modelUrl: string;
}

function DynamicModelGraph({ className, modelUrl }: DynamicModelGraphProps) {
  const file = useOnnx(modelUrl);

  return (
    <DialogContent
      className={`${className} top-[50%] min-h-[70vh] max-w-md translate-y-[-50%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl`}
    >
      <ReactOnnx width={"100%"} height={"100%"} file={file} />
    </DialogContent>
  );
}

export default DynamicModelGraph;
