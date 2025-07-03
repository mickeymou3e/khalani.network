import { ForwardedRef, forwardRef, useEffect, useState } from "react";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

const DEFAULT_TIMEOUT = 2000;
const COMPLETE_VARIANT = "success";

export type ButtonProps = {
  complete?: boolean;
  disabledLabel?: string | null;
  disabledIcon?: React.ReactNode | null;
  isLoading?: boolean;
  onHideCompleteStatus?: () => void;
} & MuiButtonProps;

const Button = forwardRef(
  (
    {
      children,
      variant,
      disabled,
      complete = false,
      disabledLabel = null,
      disabledIcon = null,
      isLoading = false,
      onClick,
      color = "primary",
      ...rest
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [buttonColor, setButtonColor] = useState(color);
    const [buttonVariant, setButtonVariant] = useState(variant);
    const [buttonDisabled, setButtonDisabled] = useState(disabled);

    useEffect(() => {
      setButtonVariant(variant);
    }, [variant]);

    useEffect(() => {
      setButtonDisabled(disabled);
    }, [disabled]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!complete) return;

      setButtonColor(COMPLETE_VARIANT);
      setButtonDisabled(true);

      setTimeout(() => {
        setButtonColor(color);
        setTimeout(() => {
          setButtonDisabled(false);
        }, DEFAULT_TIMEOUT);
      }, DEFAULT_TIMEOUT);
    };

    return (
      <MuiButton
        {...rest}
        ref={ref}
        variant={buttonVariant}
        disabled={buttonDisabled || isLoading}
        onClick={handleClick}
        color={buttonColor}
        endIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {(disabledLabel || disabledIcon) && buttonDisabled
          ? disabledLabel || disabledIcon
          : children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";
export default Button;
