import { Box, Chip, Typography } from "@mui/material";

import { formatAddress } from "@/utils/formatters";
import { evaluate } from "@/utils/logic";

import {
  styledContainer,
  styledTextContainer,
  titleStyles,
} from "./StatusAsset.styles";
import { StatusAssetProps } from "./types";
import { AddressState } from "@/types/wallet";

export const StatusAsset = ({
  label,
  description,
  state,
  LabelProps,
  DescriptionProps,
  selected,
  ...rest
}: StatusAssetProps) => {
  const chipLabel = evaluate(
    [state === AddressState.approved, ["Approved", "success"]],
    [
      state === AddressState.pending_admin_approve,
      ["Pending Admin Approve", "info"],
    ],

    [state === AddressState.pending_admin_delete, ["Pending Delete", "error"]]
  ) as any;

  return (
    <Box sx={styledContainer(selected)} {...rest}>
      <Box sx={styledTextContainer}>
        <Typography
          height={24}
          variant="body1"
          color="primary.main"
          {...LabelProps}
          sx={titleStyles}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="primary.gray2"
          {...DescriptionProps}
        >
          {formatAddress(description)}
        </Typography>
      </Box>

      {chipLabel && (
        <Chip size="small" label={chipLabel[0]} color={chipLabel[1]} />
      )}
    </Box>
  );
};
