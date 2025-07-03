import { useRef, useState } from "react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Popover, PopoverOrigin, SxProps, Theme } from "@mui/material";

import { buttonCustomStyles, popoverStyles } from "./InfoPopover.styles";
import { IconButton } from "../IconButton";

export type InfoPopoverProps = {
  disabled?: boolean;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
  buttonSize?: "small" | "medium" | "large";
  iconSize?: string;
  children: React.ReactNode;
  buttonSx?: SxProps<Theme>;
};

const InfoPopover = ({
  disabled = false,
  anchorOrigin = {
    vertical: "center",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "center",
    horizontal: "right",
  },
  width = "400px",
  buttonSize = "small",
  iconSize = "1.25rem",
  buttonSx,
  children,
}: InfoPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const combinedStyles = { ...buttonCustomStyles(iconSize), ...buttonSx };

  return (
    <>
      <IconButton
        ref={buttonRef}
        size={buttonSize}
        disabled={disabled}
        onClick={handleOpen}
        sx={combinedStyles}
      >
        <InfoOutlinedIcon />
      </IconButton>
      <Popover
        sx={popoverStyles(width)}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClick={handleClose}
        slotProps={{
          paper: {
            ref: popoverRef,
          },
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default InfoPopover;
