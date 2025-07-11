"use client";
// import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

import { create } from "zustand";

type SearchState = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    // Determine whether to apply the "file-hidden" class based on value
    const fileHiddenClass = value ? "file-hidden" : "";

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-white ring-2 ring-transparent ring-offset-[#4a4a4a] transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8f8f8f] focus:border-[#a6a6a6] focus-visible:outline-none focus-visible:ring-slate-950 focus-visible:ring-offset-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          fileHiddenClass,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

interface Props extends React.HTMLAttributes<HTMLElement> {
  // searchQuery: string;
  // setSearchQuery: (searchQuery: string) => void;
}

export default function SearchBar({
  className, // searchQuery,
  // setSearchQuery,
}: Props) {
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  return (
    <div className={cn("relative", "w-80", "border-[red]", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-4 top-0 my-auto h-4 w-4 text-[#8f8f8f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input
        type="text"
        placeholder="Search..."
        className="border-[#333333] bg-black pl-12 pr-4 placeholder:text-[#8f8f8f] focus:ring-[#8f8f8f] focus-visible:ring-0"
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
    </div>
  );
}
