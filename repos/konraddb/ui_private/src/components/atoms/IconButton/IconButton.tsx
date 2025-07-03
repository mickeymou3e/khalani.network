import React from "react";

import { Button, ButtonProps } from "../Button";
import { buttonStyle } from "./IconButton.styles";

export enum ButtonSizes {
  small = "small",
  medium = "medium",
  large = "large",
}

const IconButton = React.forwardRef(
  (
    { children, size, sx, ...rest }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const combinedStyles = [
      buttonStyle(size),
      ...(Array.isArray(sx) ? sx : [sx]),
    ];

    return (
      <Button sx={combinedStyles} ref={ref} {...rest}>
        {children}
      </Button>
    );
  }
);

export default IconButton;
