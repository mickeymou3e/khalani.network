"use client";
// ClientSearchBarWrapper.tsx
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import StaticSearchBar from "./StaticSearchBar";

const ClientSearchBarWrapper = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <SearchBar className="w-full rounded-lg bg-black" />
  ) : (
    <StaticSearchBar className="w-full rounded-lg bg-black" />
  );
};

export default ClientSearchBarWrapper;
