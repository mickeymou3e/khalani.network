import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Stack } from "@mui/material";

import {
  Asset,
  InputBase,
  Notification,
  StaticFormItem,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { PoolModes } from "@/store/pool";

import { AssetSelector } from "../AssetSelector";
import { StatsPopover } from "../StatsPopover";
import { formContainerStyles } from "./Deposit.styles";
import useDepositForm from "./useDepositForm";

const DepositForm = () => {
  const {
    formik,
    jltAsset,
    isDisabled,
    isNoAssetSelected,
    remaining,
    amountText,
    remainingText,
    assetSelectorLabel,
    poolSelectorLabel,
    poolSelectorPlaceholder,
    maxLabel,
    infoText,
    submitText,
    shouldShowInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  } = useDepositForm();

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="1.5rem" sx={formContainerStyles}>
        <AssetSelector
          disabled={isDisabled}
          action={PoolModes.Deposit}
          label={assetSelectorLabel}
          onChange={handleAssetChange}
        />
        <StaticFormItem
          label={poolSelectorLabel}
          placeholder={isNoAssetSelected ? poolSelectorPlaceholder : ""}
          disabled={isNoAssetSelected}
          customPopoverChildren={<StatsPopover disabled={isNoAssetSelected} />}
        >
          {!isNoAssetSelected && <Asset asset={jltAsset} />}
        </StaticFormItem>
        <InputBase
          id="amount"
          disabled={isNoAssetSelected}
          placeholder={Symbols.ZeroBalance}
          {...getInputProps("amount")}
          TopLabelProps={{
            LabelProps: { value: amountText },
            SecondaryLabelProps: {
              value: remainingText,
            },
            TertiaryLabelProps: {
              value: remaining.formattedValue,
            },
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
