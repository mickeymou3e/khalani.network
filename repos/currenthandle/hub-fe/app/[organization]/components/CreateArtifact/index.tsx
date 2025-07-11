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
import UploadCompiledModel from "./UploadCompiledModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnnxModel from "./OnnxModel";
import { Organization } from "../../page";
import { useState } from "react";

export default function CreateArtifact({
  organization,
}: {
  organization: Organization;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="outline" className="text-black">
          Add new...
        </Button>
      </DialogTrigger>
      <DialogContent
        closeDialog={() => setIsOpen(false)}
        className="top-[5rem] translate-y-0 bg-black text-white sm:max-w-[425px]"
      >
        <Tabs defaultValue="onnx" className="">
          <DialogHeader className="pt-4">
            <TabsList className="flex w-full ">
              <TabsTrigger value="onnx" className="flex-grow">
                ONNX
              </TabsTrigger>
              <TabsTrigger className="flex-grow" value="compiled-model">
                Compiled Model
              </TabsTrigger>
              <TabsTrigger className="flex-grow" value="random">
                Random
              </TabsTrigger>
            </TabsList>
            <TabsContent value="compiled-model">
              <UploadCompiledModel
                organization={organization}
                closeDialog={() => setIsOpen(false)}
              />
            </TabsContent>
            <TabsContent value="onnx">
              <OnnxModel
                organization={organization}
                closeDialog={() => setIsOpen(false)}
              />
            </TabsContent>
            <TabsContent
              value="random"
              className="flex w-full justify-center pt-10"
            >
              <Button>Random model...</Button>
            </TabsContent>
          </DialogHeader>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
