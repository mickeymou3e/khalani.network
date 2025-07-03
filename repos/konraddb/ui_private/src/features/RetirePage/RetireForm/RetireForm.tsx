import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Stack, Typography } from "@mui/material";

import { InputBase, Notification } from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import { AssetSelector } from "./AssetSelector";
import { formContainerStyles } from "./Retire.styles";
import useRetireForm from "./useRetireForm";

const RetireForm = () => {
  const {
    formik,
    isSubmitDisabled,
    isNoAssetSelected,
    isPoolTokenSelected,
    isRetireEnabled,
    remaining,
    amountText,
    remainingText,
    maxLabel,
    submitText,
    poolTokenInfoBold,
    poolTokenInfo,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  } = useRetireForm();

  return (
    <Box flex={1}>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="1.5rem" sx={formContainerStyles}>
          <AssetSelector onChange={handleAssetChange} />
          <InputBase
            id="amount"
            disabled={isNoAssetSelected || !isRetireEnabled}
            placeholder={Symbols.ZeroBalance}
            {...getInputProps("amount")}
            TopLabelProps={{
              LabelProps: { value: amountText },
              SecondaryLabelProps: { value: remainingText },
              TertiaryLabelProps: { value: remaining.formattedValue },
            }}
            type="number"
            InputProps={{
              endAdornment: (
                <Button
                  variant="translucent"
                  size="small"
                  disabled={isNoAssetSelected || isMaxAmountReached}
                  onClick={handleUseMaxAmount}
                >
                  {maxLabel}
                </Button>
              ),
            }}
          />
          {isPoolTokenSelected && (
            <Notification
              variant="info"
              customChildren={
                <Box>
                  <Typography
                    variant="body3"
                    fontWeight="bold"
                    display="inline"
                  >
                    {poolTokenInfoBold}
                  </Typography>
                  <Typography variant="body3" ml={0.5} display="inline">
                    {poolTokenInfo}
                  </Typography>
                </Box>
              }
            />
          )}
          <Box textAlign="center">
            <Button
              variant="translucent"
              size="medium"
              type="submit"
              startIcon={<AddCircleOutlineIcon />}
              disabled={isSubmitDisabled || !isRetireEnabled}
            >
              {submitText}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default RetireForm;
