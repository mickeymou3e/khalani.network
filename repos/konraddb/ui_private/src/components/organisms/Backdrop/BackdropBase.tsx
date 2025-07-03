import { useEffect, useState } from "react";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Backdrop from "@mui/material/Backdrop";

import { IconButton } from "@/components/atoms";

import { buttonStyle, neutralBackdropStyle } from "./BackdropBase.styles";

export interface BackdropBaseProps {
  children: React.ReactNode;
  opened?: boolean;
  onClose?: () => void;
}

const BackdropBase = ({
  children,
  opened = false,
  onClose,
}: BackdropBaseProps) => {
  const [open, setOpen] = useState(opened);

  useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleClose = () => {
    onClose?.() || setOpen(false);
  };

  if (!open) return null;

  return (
    <Backdrop open sx={neutralBackdropStyle} data-testid="neutral-backdrop">
      <IconButton
        onClick={handleClose}
        sx={buttonStyle}
        data-testid="close-button"
        size="large"
      >
        <CloseSharpIcon />
      </IconButton>

      {children}
    </Backdrop>
  );
};

export default BackdropBase;
