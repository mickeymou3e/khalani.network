import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Stack, Typography } from "@mui/material";

import { InputBase, StaticFormItem } from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import { AssetSelector } from "./AssetSelector";
import { containerStyle } from "./Form.styles";
import useForm from "./useForm";

const Form = () => {
  const {
    formik,
    isSubmitDisabled,
    isBridgeEnabled,
    isNoAssetSelected,
    remaining,
    selectedRegistryAsset,
    registryPlaceholder,
    companyPlaceholder,
    companyText,
    amountText,
    remainingText,
    maxLabel,
    submitText,
    registryLabel,
    accountLabel,
    accountInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  } = useForm();

  return (
    <Box flex={1}>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="1.5rem" sx={containerStyle}>
          <AssetSelector onChange={handleAssetChange} />
          <StaticFormItem
            label={registryLabel}
            placeholder={registryPlaceholder}
            asset={selectedRegistryAsset}
          />
          <StaticFormItem
            label={accountLabel}
            placeholder={companyPlaceholder}
            text={companyText}
            popoverChildren={
              <Typography color="primary.gray2" variant="subtitle2">
                {accountInfoText}
              </Typography>
            }
          />
          <InputBase
            id="amount"
            disabled={isNoAssetSelected || !isBridgeEnabled}
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

          <Box textAlign="center">
            <Button
              variant="translucent"
              size="medium"
              type="submit"
              startIcon={<AddCircleOutlineIcon />}
              disabled={isSubmitDisabled || !isBridgeEnabled}
            >
              {submitText}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default Form;
