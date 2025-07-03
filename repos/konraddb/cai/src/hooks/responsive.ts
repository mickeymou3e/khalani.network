import { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";

const MIN_WIDTH = 1180;
const MIN_HEIGHT = 700;

export const useLayout = () => {
  const [unsupportedWidth, setUnsupportedWidth] = useState(false);
  const [unsupportedHeight, setUnsupportedHeight] = useState(false);
  const theme = useTheme();
  const [flippable, setFlippable] = useState(false);

  const isSmallDesktop = useMediaQuery(theme.breakpoints.down("largeDesktop")); // < 1536px

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallWidth = window.innerWidth < MIN_WIDTH;
      const isSmallHeight = window.innerHeight < MIN_HEIGHT;
      const isFlippable =
        window.innerWidth < window.innerHeight &&
        window.innerWidth >= MIN_HEIGHT &&
        window.innerHeight >= MIN_WIDTH;

      setUnsupportedWidth(isSmallWidth);
      setUnsupportedHeight(isSmallHeight);
      setFlippable(isFlippable);
    };

    // A possible workaround for storybook as we can't register an event
    // listener on window object if there is an iframe in-between
    const wrapper = document.querySelector(".sb-show-main") || window;

    wrapper.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => wrapper.removeEventListener("resize", checkScreenSize);
  }, []);

  return {
    isSmallDesktop,
    unsupportedWidth,
    unsupportedHeight,
    unsupportedResolution: unsupportedWidth || unsupportedHeight,
    flippable,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
  };
};

export const useIsMobile = () => {
  if (typeof navigator !== "undefined") {
    const isMobile = /iPhone|Android.*Mobile/.test(navigator.userAgent);
    return isMobile;
  } else {
    console.info(
      "Navigator is not defined. Running in a non-browser environment."
    );
  }
};
