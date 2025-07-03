import { Typography } from "@mui/material";

import { NeutralSlider } from "@/components/atoms";
import { InfoPopover, NumericInput } from "@/components/molecules";

import { namespace } from "../../config";
import { ContentsProps } from "../Contents.types";
import useAmountEditor from "./useAmountEditor";

const AmountEditor = (props: ContentsProps) => {
  const {
    guaranteed,
    guaranteedText,
    amountLabel,
    guaranteedAmountLabel,
    guaranteedAmountHint,
    orderTypeText,
    sideText,
    handleAmountChange,
    handleSliderChange,
  } = useAmountEditor(props);

  const topLabelProps = {
    LabelProps: {
      value: amountLabel,
    },
    SecondaryLabelProps: {
      value: guaranteedAmountLabel,
    },
    TertiaryLabelProps: {
      value: guaranteedText,
    },
    QuaternaryLabelProps: {
      value: (
        <InfoPopover>
          <Typography variant="body2" color="primary.gray2">
            {guaranteedAmountHint}
          </Typography>
        </InfoPopover>
      ),
    },
  };
  const translationOptions = {
    type: orderTypeText.toLowerCase(),
    side: sideText.toLowerCase(),
    amount: guaranteed,
  };

  return (
    <>
      <NumericInput
        namespace={namespace}
        asset={props.assetDetails?.base ?? ""}
        formik={props.formik}
        formikId="amount"
        step={props.assetConfig.amountIncrement}
        disabled={!props.isValid}
        translationOptions={translationOptions}
        TopLabelProps={topLabelProps}
        onChange={handleAmountChange}
      />
      <NeutralSlider
        id="sliderValue"
        value={props.formik.values.sliderValue || 0}
        disabled={!props.isValid}
        onChange={handleSliderChange}
      />
    </>
  );
};

export default AmountEditor;
