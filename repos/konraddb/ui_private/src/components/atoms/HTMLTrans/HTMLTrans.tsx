import { Trans } from "next-i18next";

import { Box } from "@mui/material";

import { containerStyle } from "./HTMLTrans.styles";

type HTMLTransProps = {
  children: React.ReactNode;
};

const HTMLTrans = ({ children }: HTMLTransProps) => {
  const components = { ol: <ol />, ul: <ul />, li: <li /> };

  return (
    <Box sx={containerStyle}>
      <Trans components={components}>{children}</Trans>
    </Box>
  );
};

export default HTMLTrans;
