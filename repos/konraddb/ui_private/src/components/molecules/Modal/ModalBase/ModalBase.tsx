import { useEffect, useState } from "react";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Box, Dialog, ThemeProvider } from "@mui/material";

import { IconButton } from "@/components/atoms";
import { lightTheme } from "@/styles/themes";

import {
  buttonStyle,
  contentContainerStyle,
  innerContentContainerStyle,
  modalStyle,
} from "./ModalBase.styles";

export interface ModalBaseProps {
  children: React.ReactNode;
  opened?: boolean;
  disableClose?: boolean;
  contentWidth?: string;
  onClose?: () => void;
}

const ModalBase = ({
  children,
  opened = false,
  disableClose = false,
  contentWidth = "480px",
  onClose,
}: ModalBaseProps) => {
  const [open, setOpen] = useState(opened);

  useEffect(() => {
    setOpen(opened);
  }, [opened]);

  const handleClose = () => {
    onClose?.() || setOpen(false);
  };

  if (!open) return null;

  return (
    <ThemeProvider theme={lightTheme}>
      <Dialog sx={modalStyle} data-testid="neutral-modal" open fullScreen>
        {!disableClose && (
          <IconButton
            onClick={handleClose}
            sx={buttonStyle}
            data-testid="close-button"
            size="large"
          >
            <CloseSharpIcon />
          </IconButton>
        )}

        <Box sx={contentContainerStyle}>
          <Box sx={innerContentContainerStyle(contentWidth)}>{children}</Box>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
};

export default ModalBase;
