import { isValidElement } from "react";

import { Typography } from "@mui/material";

import { infoButtonStyle } from "./BasicInfoPopover.styles";
import InfoPopover, { InfoPopoverProps } from "./InfoPopover";

type BasicInfoPopoverProps = {
  children: string | React.ReactNode;
} & InfoPopoverProps;

const BasicInfoPopover = ({
  disabled,
  children,
  ...rest
}: BasicInfoPopoverProps) => {
  const isReactElement = isValidElement(children);

  return (
    <InfoPopover disabled={disabled} buttonSx={infoButtonStyle} {...rest}>
      {isReactElement && children}
      {!isReactElement && (
        <Typography variant="body2" color="primary.gray2">
          {children}
        </Typography>
      )}
    </InfoPopover>
  );
};

export default BasicInfoPopover;
