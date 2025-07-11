"use client";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import hub from "@ezkljs/hub";
import { useState } from "react";

const fileSchema = z.object({
  path: z.string(),
  file: z.custom<File | null>((value) => {
    return value instanceof File && value.name.trim() !== "";
  }, "File name can't be empty"),
});

const formSchema = z.object({
  input: fileSchema,
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  artifactId: string;
  // closeDialog: () => void;
}
export default function GetProof({
  className,
  artifactId, // closeDialog,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const inputPathValue = form.watch("input.path");

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setValueFunc: any,
    fieldName: string,
  ) {
    const file = e.target.files ? e.target.files[0] : null;
    const path = e.target.value;
    setValueFunc(`${fieldName}.path`, path);
    setValueFunc(`${fieldName}.file`, file);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const INITIATED_PROOF_MUTATION = `mutation InitiateProof($id: String!, $input: Upload!) {
      initiateProof(id: $id, input: $input) { 
        id
        status 
      }
    }`;

    const operations = {
      query: INITIATED_PROOF_MUTATION,
      variables: {
        id: artifactId,
        input: values.input.file,
      },
    };

    const map = {
      input: ["variables.input"],
    };

    const body = new FormData();
    body.append("operations", JSON.stringify(operations));
    body.append("map", JSON.stringify(map));
    body.append("input", new Blob([values.input.file as File]));

    const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
      method: "POST",
      body,
    });

    const data = await resp.json();
    console.log("data", data);
    // closeDialog();
    setIsOpen(false);
  }
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="outline"
          className={cn(
            "text-black hover:border-slate-600 hover:bg-gray-400",
            className,
          )}
        >
          Initiate Proof
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-black text-white sm:max-w-[425px]"
        closeDialog={() => setIsOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Create Proof</DialogTitle>
          <DialogDescription>Let&rsquo;s get proving!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4 text-white">
              {/* Proving Key Input */}
              <FormField
                control={form.control}
                name="input.path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input</FormLabel>
                    <FormControl>
                      <Input
                        value={inputPathValue}
                        type="file"
                        onChange={(e) =>
                          handleFileChange(e, form.setValue, "input")
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name="input.path"
                        placeholder="input"
                      />
                    </FormControl>
                    <FormDescription>Input</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Get Proof</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
