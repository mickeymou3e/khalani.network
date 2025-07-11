"use client";
import InputFile from "@/components/InputFile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const fileSchema = z.object({
  path: z.string(),
  file: z.custom<File | null>((value) => {
    console.log("Value being validated:", value);
    return value instanceof File && value.name.trim() !== "";
  }, "File name can't be empty"),
});

const formSchema = z.object({
  model: fileSchema,
  settings: fileSchema,
  pk: fileSchema,
});

export default function CreateArtifact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const modelPathValue = form.watch("model.path");
  const settingsPathValue = form.watch("settings.path");
  const pkPathValue = form.watch("pk.path");

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Raw form values:", values);
  }

  return (
    <div className="p-8 text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        </form>
      </Form>
    </div>
  );
}
