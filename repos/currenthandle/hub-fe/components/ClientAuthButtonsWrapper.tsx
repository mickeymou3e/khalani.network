"use client";
// ClientAuthButtonsWrapper.tsx
import { useState, useEffect } from "react";
import AuthButtons from "@/components/AuthButtons";
import StaticAuthButtons from "./StaticAuthButtons";

const ClientAuthButtonsWrapper = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? <AuthButtons /> : <StaticAuthButtons />;
};

export default ClientAuthButtonsWrapper;
