import { toast } from "react-toastify";
import { Trans } from "next-i18next";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";
import { Box, Typography } from "@mui/material";

import { Button } from "@/components/atoms";

import {
  iconStyle,
  leftContentStyle,
  snackbarStyle,
} from "./FixedSnackbar.styles";

export interface FixedSnackbarProps {
  text: string;
  buttonText?: string;
  id?: number;
  error?: boolean;
  onAction?: () => void;
}

const FixedSnackbar = ({
  text,
  buttonText = "",
  id = 0,
  error = false,
  onAction,
}: FixedSnackbarProps) => {
  const handleAction = () => {
    toast.dismiss(id);
    onAction?.();
  };

  const IconComponent = error
    ? ErrorOutlineOutlinedIcon
    : NotificationImportantOutlinedIcon;

  return (
    <Box sx={snackbarStyle(error)}>
      <Box sx={leftContentStyle}>
        <IconComponent sx={iconStyle(error)} />
        <Typography variant="body2" color="primary.main">
          <Trans>{text}</Trans>
        </Typography>
      </Box>

      {buttonText && (
        <Button size="small" variant="contained" onClick={handleAction}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default FixedSnackbar;
