import { notFound } from "next/navigation";

import SearchBar from "@/components/SearchBar";
import CreateArtifact from "./components/CreateArtifact";
import DisplayArtifacts from "./components/DisplayArtifacts";

import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import StaticSearchBar from "./components/StaticSearchBar";

export interface Artifact {
  name?: string;
  description?: string;
  id?: string;
  organization?: Organization;
  createdAt?: Date;
}

export interface Organization {
  name?: string;
  description?: string;
  id?: string;
}

export const buildArtifactsQuery = (
  orgName: string,
  skip: number,
  first: number,
) => {
  return `query Artifacts  {
      artifacts (organizationName: "${orgName}", skip: ${skip}, first: ${first}) {
        id
        name
        createdAt
        uncompiledModel
        proofs {
          id
          proof
          instances
        }
      }
    }`;
};

export default async function Organizations({
  params: { organization: orgName },
}: {
  params: {
    organization: string;
  };
}) {
  if (orgName === "service-worker.js") {
    console.error("Unexpected orgName:", orgName);
    return; // Or handle it differently
  }
  let initialArtifacts: Artifact[];

  const query = buildArtifactsQuery(orgName, 0, 20);

  let org = {};
  try {
    const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
      }),
    });
    // orgs = await resp.json();
    const artifactsJsonResp = await resp.json();
    console.log("artifactsJsonResp", artifactsJsonResp);
    org = artifactsJsonResp?.data?.organization;
    initialArtifacts = artifactsJsonResp?.data?.artifacts;
  } catch (e) {
    throw e;
  }

  const ClientSearchBarWrapper = dynamic(
    () => import("./components/ClientSearchBarWrapper"),
    {
      ssr: false,
      loading: () => <StaticSearchBar className="w-full rounded-lg bg-black" />,
    },
  );

  const session = await getServerSession();
  const isMyPage = session?.user.name === orgName;

  return (
    <div className="flex h-full w-full justify-center bg-[#111111] px-6 text-white">
      <div className="w-full max-w-[80rem]">
        <div
          className={`${
            isMyPage ? "grid grid-cols-[1fr,10rem] gap-x-2 " : ""
          } w-full  py-6`}
        >
          <ClientSearchBarWrapper />
          {isMyPage ? <CreateArtifact organization={org} /> : null}
        </div>
        <DisplayArtifacts
          initialArtifacts={initialArtifacts}
          orgName={orgName}
        />
      </div>
    </div>
  );
}
