import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useBreakpoints = () => {
  const theme = useTheme();
  const mobilePortrait = useMediaQuery(theme.breakpoints.up("mobilePortrait"));
  const mobileLandscape = useMediaQuery(
    theme.breakpoints.up("mobileLandscape")
  );
  const tabletPortrait = useMediaQuery(theme.breakpoints.up("tabletPortrait"));
  const tabletLandscape = useMediaQuery(
    theme.breakpoints.up("tabletLandscape")
  );
  const smallDesktop = useMediaQuery(theme.breakpoints.up("smallDesktop"));
  const largeDesktop = useMediaQuery(theme.breakpoints.up("largeDesktop"));
  const extendedDesktop = useMediaQuery(
    theme.breakpoints.up("extendedDesktop")
  );
  const fullHd = useMediaQuery(theme.breakpoints.up("fullHd"));

  return {
    mobilePortrait,
    mobileLandscape,
    tabletPortrait,
    tabletLandscape,
    smallDesktop,
    largeDesktop,
    extendedDesktop,
    fullHd,
  };
};

export default useBreakpoints;
