import { Trans } from "next-i18next";

import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import ErrorOutlineSharpIcon from "@mui/icons-material/ErrorOutlineSharp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Stack from "@mui/material/Stack";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { NotificationPropsVariant } from "@/definitions/types";
import { colorify } from "@/styles/overrides/utils";

import { stackStyle, textStyle } from "./Notification.styles";

export interface NotificationProps {
  primaryText?: string;
  variant?: NotificationPropsVariant;
  customChildren?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const Notification = ({
  primaryText,
  variant = "info",
  customChildren,
  sx,
}: NotificationProps) => {
  const theme = useTheme();
  const { green, red, blue, orange } = theme.palette.alert;

  const variants = {
    info: {
      ...colorify(blue, blue, 0.2),
      icon: () => <InfoOutlinedIcon sx={{ color: blue }} />,
    },
    warning: {
      ...colorify(orange, orange, 0.2),
      icon: () => <WarningAmberOutlinedIcon sx={{ color: orange }} />,
    },
    success: {
      ...colorify(green, green, 0.2),
      icon: () => <CheckCircleOutlineSharpIcon sx={{ color: green }} />,
    },
    error: {
      ...colorify(red, red, 0.2),
      icon: () => <ErrorOutlineSharpIcon sx={{ color: red }} />,
    },
  };
  const combinedStyles = [
    stackStyle(variants[variant].backgroundColor!),
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  return (
    <Stack sx={combinedStyles}>
      {variants[variant].icon()}
      {primaryText && (
        <Typography sx={textStyle} variant="body3" flexBasis="100%">
          <Trans>{primaryText}</Trans>
        </Typography>
      )}

      {customChildren}
    </Stack>
  );
};

export default Notification;
