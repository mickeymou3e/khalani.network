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

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import hub from "@ezkljs/hub";
import { useSession } from "next-auth/react";
import { Organization } from "../../page";
import { useContext } from "react";
import { GQL_URL } from "@/lib/constant";

const fileSchema = z.object({
  path: z.string(),
  file: z.custom<File | null>((value) => {
    return value instanceof File && value.name.trim() !== "";
  }, "File name can't be empty"),
});

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  model: fileSchema,
  settings: fileSchema,
  pk: fileSchema,
});

export default function UploadCompiledModel({
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

  const { data: session } = useSession();
  async function onSubmit({
    model,
    pk,
    settings,
    name,
    description,
  }: z.infer<typeof formSchema>) {
    await hub.uploadArtifact({
      name,
      description,
      modelFile: model.file,
      settingsFile: settings.file,
      pkFile: pk.file,
      organizationId: organization.id || "",
      url: GQL_URL,
    });

    closeDialog();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const modelPathValue = form.watch("model.path");
  const settingsPathValue = form.watch("settings.path");
  const pkPathValue = form.watch("pk.path");

  // const { close } = useContext(DialogPrimitive.DialogContext);

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
                    placeholder="Model.ezkl"
                  />
                </FormControl>
                <FormDescription>
                  Model file (ONNX, PyTorch, TensorFlow, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Model Settings Input */}
          <FormField
            control={form.control}
            name="settings.path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settings</FormLabel>
                <FormControl>
                  <Input
                    value={settingsPathValue}
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, form.setValue, "settings")
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="settings.path"
                    placeholder="settings.json"
                  />
                </FormControl>
                <FormDescription>Model Settings (JSON)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Proving Key Input */}
          <FormField
            control={form.control}
            name="pk.path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proving Key</FormLabel>
                <FormControl>
                  <Input
                    value={pkPathValue}
                    type="file"
                    onChange={(e) => handleFileChange(e, form.setValue, "pk")}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name="pk.path"
                    placeholder="Proving Key"
                  />
                </FormControl>
                <FormDescription>Proving Key</FormDescription>
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
