import { ForwardedRef, forwardRef, useEffect, useState } from "react";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

const DEFAULT_TIMEOUT = 2000;
const COMPLETE_VARIANT = "success";

export type ButtonProps = {
  complete?: boolean;
  disabledLabel?: string | null;
  disabledIcon?: React.ReactNode | null;
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
        disabled={buttonDisabled}
        onClick={handleClick}
        color={buttonColor}
      >
        {(disabledLabel || disabledIcon) && buttonDisabled
          ? disabledLabel || disabledIcon
          : children}
      </MuiButton>
    );
  }
);

export default Button;
