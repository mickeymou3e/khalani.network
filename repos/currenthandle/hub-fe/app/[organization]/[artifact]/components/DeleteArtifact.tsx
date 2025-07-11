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
import { Params } from "../page";

interface Props extends React.HTMLAttributes<HTMLElement> {
  // artifactId: string;
  // closeDialog: () => void;
  params: Params;
}
export default function DeleteArtifact({
  className,
  // artifactId, // closeDialog,
  params,
}: Props) {
  const formSchema = z.object({
    confirmation: z
      .string()
      .refine(
        (value) =>
          value.toLowerCase() ===
          `${params.organization.toLowerCase()}/${params.artifact.toLowerCase()}`,
        {
          message: `Confirmation must be "${params.organization}/${params.artifact}" (case-insensitive)`,
        },
      ),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const query = `mutation {
  deleteArtifact(organizationName: "${params.organization}", artifactName: "${params.artifact}")
}`;
    const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    const data = await resp.json();
    setIsOpen(false);
  }
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const confirmationValue = form.watch("confirmation");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue("confirmation", e.target.value);
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="outline"
          className={cn(
            "bg-red-500 text-black hover:border-slate-600 hover:bg-red-400",
            className,
          )}
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent
        className=" sm:max-w-[425px]"
        closeDialog={() => setIsOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Delete Proof</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this artifact
          </DialogDescription>
          <DialogDescription>This can not be undo</DialogDescription>
          <DialogDescription>
            If you are sure you want to delete type
            <b>organization.name/artifact / name</b>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4 text-white">
              {/* Proving Key Input */}
              <FormField
                control={form.control}
                name="confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirmation required, please type {params.organization}/
                      {params.artifact}
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={confirmationValue}
                        type="text"
                        onChange={handleChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name="confirmation"
                      />
                    </FormControl>
                    {/* <FormDescription>Input</FormDescription> */}
                    {/* <FormMessage /> */}
                    {/* <FormMessage>
                      {form.errors.confirmation &&
                        form.errors.confirmation.message}
                    </FormMessage> */}
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
