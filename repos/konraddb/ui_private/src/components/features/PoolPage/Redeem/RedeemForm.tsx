import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Stack } from "@mui/material";

import { InputBase, Notification } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { PoolModes } from "@/store/pool";

import { AssetSelector } from "../AssetSelector";
import { PoolSelector } from "../PoolSelector";
import { formContainerStyles } from "./Redeem.styles";
import useRedeemForm from "./useRedeemForm";

const DepositForm = () => {
  const {
    formik,
    isDisabled,
    isNoAssetSelected,
    isNoPoolSelected,
    remaining,
    amountText,
    remainingText,
    assetSelectorLabel,
    poolSelectorLabel,
    maxLabel,
    submitText,
    infoText,
    shouldShowInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
    handlePoolChange,
  } = useRedeemForm();

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack sx={formContainerStyles}>
        <PoolSelector
          disabled={isDisabled}
          label={poolSelectorLabel}
          onChange={handlePoolChange}
        />
        <AssetSelector
          disabled={isNoPoolSelected}
          action={PoolModes.Redeem}
          label={assetSelectorLabel}
          onChange={handleAssetChange}
        />
        <InputBase
          id="amount"
          disabled={isNoPoolSelected || isNoAssetSelected}
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
                disabled={
                  isNoPoolSelected || isNoAssetSelected || isMaxAmountReached
                }
                onClick={handleUseMaxAmount}
              >
                {maxLabel}
              </Button>
            ),
          }}
        />
        {shouldShowInfoText && (
          <Notification variant="info" primaryText={infoText} />
        )}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="translucent"
            size="medium"
            type="submit"
            startIcon={<AddCircleOutlineIcon />}
            disabled={!formik.isValid || !formik.dirty}
          >
            {submitText}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default DepositForm;
