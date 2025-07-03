import PreviewIcon from "@mui/icons-material/Preview";
import { Stack, Typography } from "@mui/material";

import { HTMLTrans } from "@/components/atoms";
import { SimpleSelect, StaticFormItem } from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { containerStyle, missingAssetPlaceholderStyle } from "./Form.styles";
import { useForm } from "./useForm";

const Form = () => {
  const {
    assets,
    registries,
    selectedAsset,
    selectedRegistry,
    isBridgeEnabled,
    isSelectedRegistry,
    bridgeInLabel,
    bridgeInPlaceholder,
    registryLabel,
    registryPlaceholder,
    selectAssetText,
    transferInstructionsLabel,
    registryInstructions,
    narTransferInstructions,
    handleChangeAsset,
    handleChangeRegistry,
  } = useForm();

  return (
    <Stack sx={containerStyle}>
      <SimpleSelect
        placeholder={bridgeInPlaceholder}
        options={assets}
        value={selectedAsset?.id ?? ""}
        disabled={!isBridgeEnabled}
        maxHeight={46}
        setValue={handleChangeAsset}
        TopLabelProps={{
          LabelProps: { value: bridgeInLabel },
        }}
        showDescription
      />
      {selectedAsset && (
        <>
          <SimpleSelect
            placeholder={registryPlaceholder}
            options={registries}
            value={selectedRegistry?.name ?? ""}
            disabled={!isBridgeEnabled}
            maxHeight={46}
            setValue={handleChangeRegistry}
            TopLabelProps={{
              LabelProps: { value: registryLabel },
            }}
            showDescription
          />

          <StaticFormItem
            label={transferInstructionsLabel}
            placeholder={
              !isSelectedRegistry && registryInstructions
                ? registryInstructions
                : ""
            }
          >
            {isSelectedRegistry && (
              <HTMLTrans>{narTransferInstructions}</HTMLTrans>
            )}
          </StaticFormItem>
        </>
      )}
      {!selectedAsset && (
        <Stack sx={missingAssetPlaceholderStyle} spacing={2}>
          <PreviewIcon sx={iconStyles()} />
          <Typography color="primary.gray2" variant="body2">
            {selectAssetText}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default Form;
