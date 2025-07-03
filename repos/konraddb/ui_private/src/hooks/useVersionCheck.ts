import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ApiRoutes } from "@/definitions/config";

export const useVersionCheck = () => {
  const router = useRouter();
  const [version, setVersion] = useState<string | null>(null);

  const fetchVersion = async () => {
    try {
      const response = await fetch(ApiRoutes.VERSION);
      if (!response.ok) {
        throw new Error(`Failed to fetch version. Status: ${response.status}`);
      }

      const data = await response.json();
      return data.buildId as string;
    } catch (error) {
      console.error("Error fetching version:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const version = await fetchVersion();
      setVersion(version);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!version) return;
    const fetchData = async () => {
      const latestVersion = await fetchVersion();
      // TODO: To remove
      console.log(latestVersion, version);
      if (latestVersion !== version) {
        router.push("/");
        // TODO: navigate to static page or display notification
      }
    };

    fetchData();
  }, [router.pathname]);
};
