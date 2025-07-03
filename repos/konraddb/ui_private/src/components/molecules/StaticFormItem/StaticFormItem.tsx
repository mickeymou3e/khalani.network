import { Box, Stack, StackProps, Typography } from "@mui/material";

import { Asset, AssetProps } from "@/components/molecules/Asset";
import { InfoPopover } from "@/components/molecules/InfoPopover";

import {
  contentContainerStyle,
  customContentStyle,
  textContentStyle,
} from "./StaticFormItem.styles";

export type StaticformItemProps = {
  label: string;
  placeholder?: string;
  text?: string;
  children?: React.ReactNode;
  popoverChildren?: React.ReactNode;
  customPopoverChildren?: React.ReactNode;
  asset?: AssetProps;
  disabled?: boolean;
} & StackProps;

const StaticformItem = ({
  label,
  placeholder,
  text,
  children,
  popoverChildren,
  customPopoverChildren,
  asset,
  disabled = false,
  ...rest
}: StaticformItemProps) => {
  const contentText = text || placeholder;
  const shouldShowContentText = Boolean(contentText);
  const contentColor = text ? "primary.main" : "primary.gray2";

  return (
    <Stack spacing={2} {...rest}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        height="1.5rem"
      >
        <Typography color="primary.gray2" variant="inputLabel">
          {label}
        </Typography>
        {popoverChildren && (
          <InfoPopover disabled={disabled}>{popoverChildren}</InfoPopover>
        )}
        {customPopoverChildren}
      </Stack>
      <Box sx={contentContainerStyle}>
        {shouldShowContentText && (
          <Typography
            sx={textContentStyle}
            color={contentColor}
            variant="inputText"
          >
            {contentText}
          </Typography>
        )}
        {children && <Stack sx={customContentStyle}>{children}</Stack>}
        {asset && (
          <Stack sx={customContentStyle}>
            <Asset {...asset} />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default StaticformItem;
