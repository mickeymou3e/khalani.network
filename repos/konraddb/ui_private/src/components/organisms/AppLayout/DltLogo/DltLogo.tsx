import Image from "next/image";

import { Box, useTheme } from "@mui/material";

import { dltLogoStyle } from "./DltLogo.styles";

const DltLogo = () => {
  const theme = useTheme();
  const dltLogoSource = `/icons/general/dlt-${theme.palette.mode}.svg`;

  return (
    <Box sx={dltLogoStyle}>
      <Image src={dltLogoSource} alt="Powered by DLT" width={160} height={32} />
    </Box>
  );
};

export default DltLogo;
