import { Box, Stack, Typography } from "@mui/material";

import { FiatCurrencies, Symbols } from "@/definitions/types";

import { discountedFeeStyle, pipeStyle } from "./Fees.styles";

export type FeesProps = {
  feeLabel?: string;
  fee: string;
  discountFee?: string;
};

const Fees = ({ feeLabel, fee, discountFee }: FeesProps) => (
  <Box component="li" display="flex" justifyContent="space-between">
    <Typography variant="body2" component="span">
      {feeLabel}
    </Typography>

    <Stack direction="row" gap={1.5}>
      {fee !== Symbols.NoBalance && fee !== Symbols.NoValue && (
        <>
          <Typography
            sx={discountedFeeStyle}
            variant="body2"
            fontWeight="bold"
            component="span"
          >
            {fee}
          </Typography>

          <Typography
            sx={pipeStyle}
            variant="body2"
            fontWeight="bold"
            component="span"
          >
            |
          </Typography>

          {discountFee && (
            <Typography variant="body2" fontWeight="bold" component="span">
              {discountFee}
            </Typography>
          )}
        </>
      )}

      {(fee === Symbols.NoBalance || fee === Symbols.NoValue) && (
        <Typography variant="body2" fontWeight="bold" component="span">
          {fee}
        </Typography>
      )}

      <Typography variant="body2" fontWeight="bold" component="span">
        {FiatCurrencies.EUR}
      </Typography>
    </Stack>
  </Box>
);

export default Fees;
