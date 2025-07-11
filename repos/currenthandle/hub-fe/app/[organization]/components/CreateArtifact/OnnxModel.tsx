"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

// import { DialogFooter } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import hub from "@ezkljs/hub";
// import { useSession } from "next-auth/react";
import { Organization } from "../../page";
import { GQL_URL } from "@/lib/constant";

const fileSchema = z.object({
  path: z.string(),
  file: z.custom<File | null>((value) => {
    console.log("Value being validated:", value);
    return value instanceof File && value.name.trim() !== "";
  }, "File name can't be empty"),
});

const formSchema = z.object({
  model: fileSchema,
  input: fileSchema,
  name: z.string(),
  description: z.string(),
});

export default function OnnxModel({
  organization,
  closeDialog,
}: {
  organization: Organization;
  closeDialog: () => void;
}) {
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setValueFunc: any,
    fieldName: string,
  ) {
    if (fieldName === "name" || fieldName === "description") {
      setValueFunc(fieldName, e.target.value);
    } else {
      const file = e.target.files ? e.target.files[0] : null;
      const path = e.target.value;
      setValueFunc(`${fieldName}.path`, path);
      setValueFunc(`${fieldName}.file`, file);
    }
  }

  // const session = useSession();
  async function onSubmit({
    model,
    input,
    name,
    description,
  }: z.infer<typeof formSchema>) {
    try {
      const newOnnx = await hub.genArtifact({
        name,
        description,
        uncompiledModelFile: model.file,
        inputFile: input.file,
        organizationId: organization.id || "",
        url: GQL_URL,
      });
      closeDialog();
    } catch (e) {
      console.log("error:", e);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const modelPathValue = form.watch("model.path");
  const inputPathValue = form.watch("input.path");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 py-4 text-white">
          {/* Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    value={modelPathValue}
                    type="text"
                    onChange={(e) => handleFileChange(e, form.setValue, "name")}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name=""
                    placeholder="Artifact Name"
                  />
                </FormControl>
                <FormDescription>Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    value={modelPathValue}
                    type=""
                    onChange={(e) => {
                      handleFileChange(e, form.setValue, "description");
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name=""
                    placeholder="Artifact Description"
                  />
                </FormControl>
                <FormDescription>Description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Model Input */}
          <FormField
            control={form.control}
            name="model.path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input
                    value={modelPathValue}
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, form.setValue, "model")
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="model.path"
                    placeholder="Model.onnx"
                  />
                </FormControl>
                <FormDescription>
                  Model file (ONNX, PyTorch, TensorFlow, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Input Input */}
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
                    onChange={
                      (e) => handleFileChange(e, form.setValue, "input") // Change "pk" to "input"
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="input.path" // Change "pk.path" to "input.path"
                    placeholder="input.json"
                  />
                </FormControl>
                <FormDescription>input.json</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Upload Artifact</Button>
        </DialogFooter> */}
      </form>
    </Form>
  );
}
