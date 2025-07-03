import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const useAutoLogin = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isAuthenticated, loginWithRedirect, isLoading]);
};
