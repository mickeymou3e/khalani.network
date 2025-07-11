"use client";
import {
  CodeBlock,
  CopyBlock,
  Code,
  dracula,
  atomOneDark,
} from "react-code-blocks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import code from "./settings.json";

export default function codeViewSettings({ code }: { code: any }) {
  const customReplacer = (key: string, value: unknown): unknown => {
    if (Array.isArray(value)) {
      if (value.length === 0) return "EMPTY_ARRAY_PLACEHOLDER";
      if (value.length === 1 && typeof value[0] === "number")
        return `SINGLE_NUMBER_ARRAY_PLACEHOLDER_${value[0]}`;
    }
    return value;
  };

  const customStringify = (value: unknown): string => {
    let result = JSON.stringify(value, customReplacer, 2);
    result = result.replace(/"EMPTY_ARRAY_PLACEHOLDER"/g, "[]");
    result = result.replace(/"SINGLE_NUMBER_ARRAY_PLACEHOLDER_(\d+)"/g, "[$1]");
    return result;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black  hover:border-slate-600 hover:bg-gray-400"
        >
          View Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="h-72 min-h-[90vh] max-w-md translate-y-[-24rem] overflow-auto bg-black sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <CopyBlock
          // @ts-ignore
          text={customStringify(code)}
          theme={atomOneDark}
          language="json"
          showLineNumbers={true}
        />
      </DialogContent>
    </Dialog>
  );
}
