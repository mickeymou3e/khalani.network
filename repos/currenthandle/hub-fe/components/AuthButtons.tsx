"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButtons() {
  return (
    <div className="mt-4 flex space-x-4">
      <Button onClick={() => signIn("ezkl")}>Sign in</Button>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
