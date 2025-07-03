import React, { useRef } from "react";

import { Box, InputAdornment, TextField, Typography } from "@mui/material";

import { InputLabel } from "../InputLabel";
import NumberFormatCustom from "../NumericFormat/NumericFormat";
import { inputStyle } from "./InputBase.styles";
import { InputBaseProps } from "./types";
import { Asset } from "../Asset";

const InputBase = ({
  TopLabelProps,
  BottomLabelProps,
  assets,
  trailingText,
  alert = false,
  setValue,
  InputProps,
  isNumber = false,
  sx,
  tooltipTitle,
  ...rest
}: InputBaseProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue?.(event.target.value);
  };

  const handleFocus = () => {
    if (!ref.current) return;

    const input = ref.current.querySelector("input");

    if (rest.type === "number" || !input) return;

    input.selectionStart = input.value.length;
    input.selectionEnd = input.value.length;
  };

  return (
    <Box sx={sx} display="flex" flexDirection="column" gap={1.5}>
      {TopLabelProps && (
        <InputLabel tooltipTitle={tooltipTitle} {...TopLabelProps} />
      )}
      <TextField
        sx={inputStyle(alert)}
        fullWidth
        onChange={handleChange}
        onFocus={handleFocus}
        InputProps={{
          ref,
          startAdornment: assets && (
            <InputAdornment position="start">
              <Asset assets={assets} />
            </InputAdornment>
          ),
          endAdornment: trailingText ? (
            <InputAdornment position="end">
              <Typography>{trailingText}</Typography>
            </InputAdornment>
          ) : (
            InputProps?.endAdornment
          ),
          ...InputProps,
          inputComponent: isNumber ? (NumberFormatCustom as any) : undefined,
        }}
        {...rest}
      />
      {BottomLabelProps?.LabelProps?.value && (
        <InputLabel error={rest.error} {...BottomLabelProps} />
      )}
    </Box>
  );
};

export default InputBase;
