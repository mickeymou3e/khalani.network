"use client";

import { FC, PropsWithChildren, useState } from "react";
import createCache, { Options } from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "@hadouken-project/ui";

const generateTheme = () => {
  const newTheme = theme;

  if (!newTheme.components) return newTheme;

  newTheme.components.MuiCssBaseline = {
    styleOverrides: `
      body {
        height: 100vh;
        width: 100%;
        background-color: ${newTheme.palette.background.default};
        background-repeat: no-repeat;
        background-size: cover;
       }
       @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-Bold.woff2) format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 600;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-SemiBold.woff2') format('woff2');
      }
      @font-face {
        font-family: 'IBM Plex Mono';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('IBM Plex Mono'), url(../fonts/IBM-plex-mono/IBMPlexMono-Medium.woff2) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 700;
        src: local('Sarpanch'), url(../fonts/sarpanch/sarpanch-700.woff2) format('woff2');
      }
      @font-face {
        font-family: 'Sarpanch';
        font-style: 'normal';
        font-display: 'swap';
        font-weight: 500;
        src: local('Sarpanch'), url(../fonts/sarpanch/sarpanch-500.woff2) format('woff2');
      }
    `,
  };

  return newTheme;
};

export const ThemeRegistry: FC<PropsWithChildren<{ options: Options }>> = ({
  options,
  children,
}) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={generateTheme()}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
