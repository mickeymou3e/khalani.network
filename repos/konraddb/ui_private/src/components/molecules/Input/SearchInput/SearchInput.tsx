import { ChangeEvent, useCallback, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { debounce } from "@mui/material";

import { IconButton } from "@/components/atoms";

import { InputBase, InputBaseProps } from "../InputBase";

export const SearchInput = ({
  setValue,
  value,
  disabled,
  ...rest
}: InputBaseProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const debouncedCallback = useCallback(
    debounce((value: string) => setValue?.(value), 500),
    []
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
    debouncedCallback(event.target.value);
  };

  const clearHandler = () => setValue?.("");

  return (
    <InputBase
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <IconButton
            variant="translucent"
            size="small"
            disabled={!value || disabled}
            onClick={clearHandler}
          >
            <CloseIcon />
          </IconButton>
        ),
      }}
      data-testid="search-input"
      {...rest}
    />
  );
};
