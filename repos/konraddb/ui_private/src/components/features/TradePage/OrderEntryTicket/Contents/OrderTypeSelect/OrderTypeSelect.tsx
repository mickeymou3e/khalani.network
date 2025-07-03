import { SimpleSelect } from "@/components/molecules";

import { ContentsProps } from "../Contents.types";
import useAssetSelect from "./useOrderTypeSelect";

export type OrderTypeSelectProps = Omit<ContentsProps, "formik" | "isLimit">;

const OrderTypeSelect = (props: OrderTypeSelectProps) => {
  const {
    selectOptions,
    selectValue,
    selectLabel,
    selectSecondaryLabel,
    selectTertiaryLabel,
    handleSetValue,
  } = useAssetSelect(props);

  return (
    <SimpleSelect
      value={selectValue}
      options={selectOptions}
      disabled={!props.isValid}
      TopLabelProps={{
        LabelProps: {
          value: selectLabel,
        },
        SecondaryLabelProps: {
          value: selectSecondaryLabel,
        },
        TertiaryLabelProps: {
          value: selectTertiaryLabel,
        },
      }}
      setValue={handleSetValue}
    />
  );
};

export default OrderTypeSelect;
