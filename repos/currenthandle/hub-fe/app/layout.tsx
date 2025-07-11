// import SideNav from "@/components/SideNav";
import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import TopNav from "@/components/Header";
import Header from "@/components/Header";
import NextAuthProvider from "@/app/context/NextAuthProvider";
import QueryProvider from "@/app/QueryProvider";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";

// import { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ezkl hub",
  description:
    "manage your artifacts, proofs, and verification easily on the ezkl hub",
};

export default async function RootLayout({ children, ...props }: any) {
  // const session = await getServerSession();
  // console.log("session", session);
  // const token = authHeader.split(" ")[1];
  // console.log("token", token);
  // const serverSession = getServerSession();
  // const session = await serverSession.console.log(
  //   "serverSession",
  //   serverSession,
  // );
  // console.log("session", session);
  // if (!session) {
  //   redirect("/");
  // }
  return (
    <html lang="en">
      <body className="bg-body">
        <NextAuthProvider>
          <div className="max-w-screen h-screen min-h-screen w-screen">
            <Header />
            <main className=" bg-[#111111]">
              <QueryProvider>{children}</QueryProvider>
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
