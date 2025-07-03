import { useState } from "react";

import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { InputBase, InputBaseProps } from "../InputBase";
import { StyledIconButton } from "./PasswordInput.styles";

const PasswordInput = ({
  setValue,
  value,
  disabled,
  ...rest
}: InputBaseProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputType = passwordVisible ? "text" : "password";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue?.(event.target.value);
  };

  const handleSwitchVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <InputBase
      value={value}
      disabled={disabled}
      type={inputType}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <StyledIconButton
            variant="outlined"
            size="small"
            disabled={!value || disabled}
            onClick={handleSwitchVisibility}
          >
            {passwordVisible ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </StyledIconButton>
        ),
      }}
      data-testid="password-input"
      {...rest}
    />
  );
};

export default PasswordInput;
