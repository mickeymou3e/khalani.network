import { RefObject, useMemo } from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { PopoverProps } from "@mui/material";
import { Box, InputAdornment, Popover, SxProps, Theme } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import useDetectScrollbar from "@/hooks/useDetectScrollbar";

import { dropdownInputStyle, dropdownPaperStyle } from "./SelectBase.styles";
import { useSelectBase } from "./useSelectBase";
import { CircularProgress } from "@/components/CircularProgress";
import { InputBase } from "@/components/InputBase";
import { InputLabelProps } from "@/components/InputLabel";

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
  displayLoader?: boolean | never[];
  dataTestId?: string;
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
  displayLoader = false,
  dataTestId,
  children,
  renderValue,
  setValue,
}: SelectBaseProps) => {
  const hasOneOption = useMemo(
    () => options.length === 1 && value,
    [options]
  ) as boolean;

  const { opened, menuMinWidth, anchorEl, handleClick, handleClose } =
    useSelectBase(disabled, hasOneOption);
  const { scrollbarDetectRef, hasScrollbar } = useDetectScrollbar();

  const handleItemClick = (option: string) => () => {
    setValue?.(option);
    handleClose();
  };

  const getEndAdornment = () => {
    if (hasOneOption) return null;

    const icon = opened ? <ExpandLessIcon /> : <ExpandMoreIcon />;
    return displayLoader ? (
      <CircularProgress />
    ) : (
      <InputAdornment position="end" disablePointerEvents>
        {icon}
      </InputAdornment>
    );
  };

  return (
    <Box sx={sx}>
      <InputBase
        sx={dropdownInputStyle(!!renderValue)}
        value={renderValue ? "" : value}
        placeholder={value ? "" : placeholder}
        focused={opened}
        InputProps={{
          readOnly: true,
          startAdornment: renderValue?.(value),
          endAdornment: getEndAdornment(),
        }}
        disabled={disabled}
        onClick={handleClick}
        size={size}
        TopLabelProps={TopLabelProps}
        BottomLabelProps={BottomLabelProps}
        data-testid={dataTestId}
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
