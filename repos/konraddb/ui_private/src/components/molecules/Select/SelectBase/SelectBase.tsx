import { RefObject } from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { PopoverProps } from "@mui/material";
import { Box, InputAdornment, Popover, SxProps, Theme } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import { Input, InputLabelProps } from "@/components/molecules";
import useDetectScrollbar from "@/hooks/useDetectScrollbar";

import { dropdownInputStyle, dropdownPaperStyle } from "./SelectBase.styles";
import { useSelectBase } from "./useSelectBase";

export type SelectBaseProps = {
  value: unknown;
  options?: unknown[];
  maxHeight?: number;
  disabled?: boolean;
  placeholder?: string;
  popoverAnchorOrigin?: PopoverProps["anchorOrigin"];
  popoverTransformOrigin?: PopoverProps["transformOrigin"];
  popoverAction?: PopoverProps["action"];
  sx?: SxProps<Theme>;
  size?: "small" | "medium";
  TopLabelProps?: InputLabelProps;
  BottomLabelProps?: InputLabelProps;
  children?: (
    onClose: () => void,
    scrollbarDetectRef: RefObject<any>,
    hasScrollbar: boolean
  ) => React.ReactNode;
  renderValue?: (value: unknown) => React.ReactNode | undefined;
  setValue?: (value: unknown) => void;
};

const SelectBase = ({
  value,
  options = [],
  maxHeight = 57,
  disabled = false,
  placeholder = "Select",
  sx,
  size = "medium",
  popoverAnchorOrigin = {
    vertical: "bottom",
    horizontal: "left",
  },
  popoverTransformOrigin,
  popoverAction,
  TopLabelProps,
  BottomLabelProps,
  children,
  renderValue,
  setValue,
}: SelectBaseProps) => {
  const { opened, menuMinWidth, anchorEl, handleClick, handleClose } =
    useSelectBase(disabled);
  const { scrollbarDetectRef, hasScrollbar } = useDetectScrollbar();

  const handleItemClick = (option: string) => () => {
    setValue?.(option);
    handleClose();
  };

  return (
    <Box sx={sx}>
      <Input
        sx={dropdownInputStyle(!!renderValue)}
        value={renderValue ? "" : value}
        placeholder={value ? "" : placeholder}
        focused={opened}
        InputProps={{
          readOnly: true,
          startAdornment: renderValue?.(value),
          endAdornment: (
            <InputAdornment position="end" disablePointerEvents>
              {opened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </InputAdornment>
          ),
        }}
        disabled={disabled}
        onClick={handleClick}
        size={size}
        TopLabelProps={TopLabelProps}
        BottomLabelProps={BottomLabelProps}
      />
      <Popover
        sx={dropdownPaperStyle(menuMinWidth, maxHeight, hasScrollbar)}
        open={opened}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={popoverAnchorOrigin}
        transformOrigin={popoverTransformOrigin}
        action={popoverAction}
      >
        {children?.(handleClose, scrollbarDetectRef, hasScrollbar) || (
          <MenuList ref={scrollbarDetectRef}>
            {options.map((option) => {
              const displayValue = option as string;
              return (
                <MenuItem
                  key={displayValue}
                  onClick={handleItemClick(displayValue)}
                >
                  {displayValue}
                </MenuItem>
              );
            })}
          </MenuList>
        )}
      </Popover>
    </Box>
  );
};

export default SelectBase;
