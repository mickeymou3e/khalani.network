import { useTranslation } from "next-i18next";

import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { disclaimerWrapper } from "./AuthDisclaimer.styles";

const AuthDisclaimer = () => {
  const { t } = useTranslation("common");

  return (
    <Box sx={disclaimerWrapper}>
      <LocalPoliceOutlinedIcon sx={{ color: "primary.gray2" }} />
      <Typography color="primary.gray2" variant="body2">
        {t(`common:authDisclaimer`)}
      </Typography>
    </Box>
  );
};

export default AuthDisclaimer;
