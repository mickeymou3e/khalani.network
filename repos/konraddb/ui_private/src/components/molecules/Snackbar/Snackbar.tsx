import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ErrorOutlineSharpIcon from "@mui/icons-material/ErrorOutlineSharp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { IconButton } from "@/components/atoms";
import { SnackbarVariant } from "@/definitions/types";
import { colorify } from "@/styles/overrides/utils";

import { StyledStack } from "./Snackbar.styles";

export interface SnackbarProps {
  primaryText: string;
  secondaryText?: string;
  variant?: keyof typeof SnackbarVariant;
  link?: string;
  id?: number;
}

const Snackbar = ({
  primaryText,
  secondaryText,
  variant = SnackbarVariant.info,
  link,
  id,
}: SnackbarProps) => {
  const theme = useTheme();
  const { green, red, blue } = theme.palette.alert;

  const variants = {
    info: {
      ...colorify(blue, blue, 0.2),
      icon: () => <InfoOutlinedIcon sx={{ color: blue }} />,
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

  const handleCloseSnackbar = () => {
    toast.dismiss(id);
  };

  const [completed, setCompleted] = useState(100);

  useEffect(() => {
    setTimeout(() => setCompleted(0), 100);
  }, []);

  return (
    <StyledStack
      snackbarbackground={variants[variant].backgroundColor}
      progressbarbackground={variants[variant].color}
      completed={completed}
    >
      {variants[variant].icon()}
      <Typography variant="body2" flexBasis="100%">
        {primaryText}
      </Typography>

      <Typography
        variant="buttonSmall"
        sx={{
          textTransform: "uppercase",
        }}
      >
        {secondaryText}
      </Typography>

      {link && (
        <IconButton size="small" href={link}>
          <LaunchSharpIcon />
        </IconButton>
      )}

      <IconButton size="small" onClick={handleCloseSnackbar}>
        <CloseSharpIcon />
      </IconButton>
    </StyledStack>
  );
};

export default Snackbar;
