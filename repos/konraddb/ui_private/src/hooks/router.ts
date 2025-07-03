import { useEffect } from "react";
import { useRouter } from "next/router";

export const useLeaveRouteEffect = (callback: () => void) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      callback();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);
};

export const useEnterRouteEffect = (callback: () => void) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      callback();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
};
