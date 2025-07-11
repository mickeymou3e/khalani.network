// "use client";
// import { useEffect, useRef, useState } from "react";
import GetProof from "./components/GetProof";
import { Separator } from "@/components/ui/separator";
import ModelGraph from "./components/ModelGraph";
import ProofTable from "./components/ProofTable";
import ViewSettings from "./components/ViewSettings";
import z from "zod";
import { Card } from "@/components/ui/card";
// import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteArtifact from "./components/DeleteArtifact";
import { getServerSession } from "next-auth";

import { notFound } from "next/navigation";

const organizationParser = z.object({
  name: z.string(),
  // description: z.string(),
});

const proofParser = z.object({
  id: z.string(),
  timeTaken: z.number(),
  instances: z.array(z.string()),
  status: z.string(),
  proof: z.string(),
});

export type Proof = z.infer<typeof proofParser>;

const artifactParser = z.object({
  name: z.string(),
  description: z.string(),
  // id: z.string(),
  createdAt: z.string(),
  // organization: organizationParser,
  proofs: z.array(proofParser),
  uncompiledModel: z.string().nullable(),
});

export interface Params {
  artifact: string;
  organization: string;
}

// interface Props extends React.HTMLAttributes<HTMLElement> {
//   params: Params;
// }
interface Props {
  params: Params;
}
const convertBytesToReadableString = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default async function Page({ params }: Props) {
  // notFound();
  // return {
  //   notFound: true,
  // };
  // return {};
  const decodedOrganization = decodeURIComponent(params.organization);
  const decodedArtifact = decodeURIComponent(params.artifact);

  const deleteArtifact = async () => {
    const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {
            deleteArtifact(artifactId: "${decodedArtifact}")
          }`,
      }),
    });
    const data = await resp.json();
  };

  const body = JSON.stringify({
    query: `
    query artifact {
      artifact(organizationName: "${decodedOrganization}", name:"${decodedArtifact}") {
        id
        name
        description
        createdAt
        uncompiledModel
        proofs {
          status
          id
          proof
          instances
          timeTaken
        }
        organization {
          id
          name
        }
      }
    }
    `,
  });

  const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const { data } = await resp.json();

  if (!data?.artifact) {
    notFound();
  }

  const jsonResp = await fetch(
    `https://hub-staging.ezkl.xyz/download/${data.artifact.id}/settings.json`,
  );
  const jsonCode = await jsonResp.json();

  const model: {
    size: string;
    file: Blob | null;
    url: string;
  } = { size: "unknown", file: null, url: "" };
  if (data.artifact.uncompiledModel) {
    const modelUrl = `https://hub-staging.ezkl.xyz/download/${data.artifact.id}/network.onnx`;

    const modelResp = await fetch(modelUrl);
    const modelBlob = await modelResp.blob();
    model.size = convertBytesToReadableString(modelBlob.size);
    model.file = modelBlob;
    model.url = modelUrl;
  }

  const artifact = artifactParser.parse(data?.artifact);
  const { name, proofs, description } = artifact;

  // const isMyName = true;
  const session = await getServerSession();
  const isMyPage =
    session?.user.name.toLowerCase() === decodedOrganization.toLowerCase();
  return (
    <div className="flex h-full w-full flex-col items-start justify-between bg-[##111111] text-white">
      <div className="flex w-full justify-center border-b-[1px] border-[#333333]">
        <div className="grid w-full max-w-[80rem] grid-cols-12 grid-rows-5 gap-4 border-0 border-red-500  p-4 px-2 sm:px-4 md:grid-rows-4">
          <div className="col-span-12 col-start-1 row-span-1 row-start-1 w-full border-0 border-blue-500 md:col-span-6">
            {/* Row 1 */}
            <div className=" flex w-full items-center justify-start space-x-6 border-0 border-purple-500">
              {/* <div className="flex items-center justify-start">
              </div> */}
              <h2 className="py-4 text-3xl">{name}</h2>
              <div className="h-6 w-6 rounded-[100%] border-[1px] border-green-300 bg-green-500"></div>
              {isMyPage ? (
                <>
                  <GetProof artifactId={data.artifact.id} />
                  <DeleteArtifact params={params} />
                </>
              ) : null}
            </div>
          </div>
          <div className="col-span-6 row-start-2 flex-col items-center border-0 border-yellow-500">
            <h3>Description:</h3>
            <p className="py-4">{description}</p>
          </div>
          {/* Row 2 */}
          <div className="col-span-8 col-start-1 row-span-1 row-start-3  flex h-full items-center justify-between border-0 border-green-500 sm:col-span-6 md:col-span-5 md:col-start-9 md:row-start-1 lg:col-span-3 lg:col-start-10">
            {artifact?.uncompiledModel ? (
              <ModelGraph modelUrl={model.url} />
            ) : (
              <Button
                variant="outline"
                className={cn(
                  "text-black",
                  "cursor-not-allowed border-slate-600	 bg-gray-700 hover:border-slate-600 hover:bg-gray-700",
                )}
              >
                View Model
              </Button>
            )}
            <ViewSettings code={jsonCode} />
          </div>
          <Info
            modelSize={model.size}
            className="col-span-10 row-span-2 row-start-4 md:col-span-8 md:row-start-3 lg:col-span-7"
            data={data?.artifact}
          />
        </div>
      </div>
      <div className="flex w-full justify-center  ">
        <div className="w-full max-w-[80rem] flex-grow border-0 border-yellow-500 px-2 py-10 sm:px-6">
          <ProofTable
            proofs={proofs || []}
            organizationName={decodedOrganization}
          />
        </div>
      </div>
    </div>
  );
}

type Artifact = z.infer<typeof artifactParser>;
interface InfoProps extends React.HTMLAttributes<HTMLElement> {
  data: Artifact;
  modelSize: string;
}

function Info({ data, className, modelSize }: InfoProps) {
  const artifact = artifactParser.parse(data);
  const date = new Date(artifact.createdAt);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).substring(2);

  const formattedDate = `${month}/${day}/${year}`;

  return (
    <Card className={cn("space-y-6 bg-transparent p-4 text-white", className)}>
      <div className="flex justify-between border-b-[1px] border-dashed">
        <p className="lg:mr-1">Created:</p>
        <p>
          <b>{formattedDate}</b>
        </p>
      </div>
      <div className="flex justify-between border-b-[1px] border-dashed">
        <p className="lg:mr-1">Proofs Generated</p>
        <p>
          <b>{artifact.proofs.length}</b>
        </p>
      </div>
      <div className="flex justify-between border-b-[1px] border-dashed">
        <p className="lg:mr-1">Model Size:</p>
        <p>
          <b>{modelSize}</b>
        </p>
      </div>
    </Card>
  );
}
