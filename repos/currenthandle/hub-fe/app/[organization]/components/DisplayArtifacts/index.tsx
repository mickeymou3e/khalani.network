"use client";
// import FadeLoader from "react-spinners/FadeLoader";
import { FadeLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";
import hub from "@ezkljs/hub";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Artifact, Organization } from "../../page";
import { Button } from "@/components/ui/button";

import { buildArtifactsQuery } from "../../page";

import { useSearchStore } from "@/components/SearchBar";

export default function DisplayArtifacts({
  initialArtifacts,
  // searchQuery,
  orgName,
}: {
  initialArtifacts: Artifact[];
  // searchQuery: string;
  orgName: string;
}) {
  const searchQuery = useSearchStore((state) => state.searchQuery);

  const filterSearch = ({ name, description, id }: Artifact) => {
    if (!searchQuery) return true;
    if (
      name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return true;
    }
    return false;
  };

  const { data, isLoading, isFetching, error, fetchNextPage } =
    useInfiniteQuery<Artifact[]>(
      ["artifacts"],
      // ({ pageParam = 0 }) => hub.getArtifacts({ skip: pageParam, first: 20 }),
      async ({ pageParam = 0 }) => {
        console.log("pageParam", pageParam);
        const query = buildArtifactsQuery(orgName, pageParam, 20);

        console.log("query", query);
        const resp = await fetch("https://hub-staging.ezkl.xyz/graphql", {
          // cache: "no-store",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
          }),
        });
        const { data } = await resp.json();
        const artifacts = data.artifacts;
        return artifacts;
        //hub.getArtifacts({ skip: pageParam, first: 20 });
      },
      {
        // getNextPageParam: (lastPage, allPages) => {
        //   const nextPageParam = allPages.length ? allPages.length * 20 : 20;
        //   console.log("Next pageParam", nextPageParam);
        //   return nextPageParam;
        // },
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.length === 0) return undefined;
          return allPages.flatMap((page) => page).length;
        },
        initialData: {
          pages: [initialArtifacts],
          pageParams: [0], // Assuming initial pageParam is 0.
        },
      },
    );

  console.log("data", data);

  // console.log("data", data?.length);

  // const [flatData, setFlatData] = useState(initialArtifacts);
  // console.log("flatData", flatData.length);

  // useEffect(() => {
  //   if (data) {
  //     const newPage = data.pages[data.pages.length - 1];
  //     setFlatData((prevData) => [...prevData, ...newPage]);
  //   }
  // }, [data, data?.pages.length]);
  // const flatData = data
  //   ? data.pages.reduce((acc, page) => acc.concat(page), [])
  //   : [];

  // console.log("flatData", flatData.length);

  // const filteredData = flatData.filter(filterSearch);

  const sortFn = (a: Artifact, b: Artifact) => {
    if (!a.createdAt || !b.createdAt) return 0;
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  };

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    const currentRef = loadMoreRef.current; // Copy ref to a variable.
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef); // Use the variable in cleanup.
    };
  }, [fetchNextPage]);
  // console.log("data", data);

  // const flatData = data ?
  console.log("data.pages", data?.pages.length);
  console.log("total length", data?.pages.flatMap((page) => page).length);
  data?.pages.forEach((page, i) =>
    console.log(`page ${i + 1} length`, page.length),
  );

  console.log("isLoading", isLoading);
  console.log("isFetching", isFetching);

  return (
    <div>
      <div className="grid w-full grid-cols-1 gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.pages
          .flatMap((page) => page)
          .map(({ name, description, id }, i) => (
            <Link key={name} href={`/${orgName}/${name?.toLowerCase()}`}>
              <Card className="group relative flex h-[12.5rem] w-full flex-col justify-between border-[1px] border-[#333333] bg-black p-6 hover:border-white">
                <CardHeader className="flex w-full flex-row items-center space-y-0 p-0">
                  {/* <Badge className="mr-3 h-8 w-8 border-[1px] border-[#242424]" /> */}
                  <CardTitle className="text-md	normal-case text-white ">
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between p-0 text-sm text-[#a1a1a1]">
                  <div>{id}</div>
                  <div>{description}</div>
                </CardFooter>
                <LinkIcon />
              </Card>
              {/* {i === flatData.length - 6 ? <div ref={loadMoreRef} /> : null} */}
            </Link>
          ))}
        <div ref={loadMoreRef} />
      </div>
      {isFetching && (
        <div className="flex w-full justify-center">
          <FadeLoader color="white" speedMultiplier={2} loading={true} />
        </div>
      )}
    </div>
  );
}

function LinkIcon() {
  return (
    <div className="duration-250 absolute right-[-10px] top-[-10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white p-[7px] opacity-0 transition-opacity group-hover:opacity-100">
      <svg
        data-testid="geist-icon"
        fill="none"
        height="24"
        shapeRendering="geometricPrecision"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        style={{ color: "currentcolor" }}
      >
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
        <path d="M15 3h6v6"></path>
        <path d="M10 14L21 3"></path>
      </svg>
    </div>
  );
}
