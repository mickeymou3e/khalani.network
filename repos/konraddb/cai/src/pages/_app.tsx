import { AppProps } from "next/app";
import "../styles/globalOverrides.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "@/styles/themes";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useApiAuthInterceptor } from "@/api/data";
import { useRouter } from "next/router";
import { useAutoLogin } from "@/hooks/useAutoLogin";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  useAutoLogin();

  const onRedirectCallback = (appState?: any) => {
    router.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="dev-6gsmle6cti46be8p.us.auth0.com"
      clientId="vEvr1G8aeTNVm2KoFRDTNILOD3r9KQCy"
      authorizationParams={{
        audience: "https://cai-api-dev.neutralx.com",
        redirect_uri:
          typeof window !== "undefined"
            ? window.location.origin + "/data"
            : undefined,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <AuthInterceptorWrapper />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

function AuthInterceptorWrapper() {
  useApiAuthInterceptor();
  return null;
}

export default App;
