import Brightness5OutlinedIcon from "@mui/icons-material/Brightness5Outlined";
import { Box, Typography } from "@mui/material";

import { iconStyles } from "@/styles/others/muiIconStyles";

import { containerStyle } from "./CallToAction.styles";

type CallToActionProps = {
  actionText?: string;
  iconComponent?: React.ReactNode;
};

const CallToAction = ({ actionText, iconComponent }: CallToActionProps) => (
  <Box sx={containerStyle}>
    {iconComponent ?? <Brightness5OutlinedIcon sx={iconStyles()} />}
    <Typography variant="body2" color="primary.gray2">
      {actionText}
    </Typography>
  </Box>
);

export default CallToAction;
