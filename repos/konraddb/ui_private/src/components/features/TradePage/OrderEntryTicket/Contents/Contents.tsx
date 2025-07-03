import { Box } from "@mui/material";

import { NumericInput } from "@/components/molecules";

import { AmountEditor } from "./AmountEditor";
import { containerStyle } from "./Contents.styles";
import { OrderTypeSelect } from "./OrderTypeSelect";
import { SubmitButton } from "./SubmitButton";
import { TransactionDetails } from "./TransactionDetails";
import { useContents } from "./useContents";

const Contents = () => {
  const config = useContents();

  return (
    <form>
      <Box sx={containerStyle}>
        <OrderTypeSelect {...config} />
        {config.isLimit && (
          <NumericInput
            label={config.priceLabel}
            namespace={config.namespace}
            asset={config.assetDetails?.quote ?? ""}
            formik={config.formik}
            formikId="price"
            step={config.assetConfig.priceIncrement}
            disabled={!config.isValid}
          />
        )}
        <AmountEditor {...config} />
        <TransactionDetails
          minAmount={config.assetConfig.minAmount}
          marketPrice={config.price}
          total={config.formik.values.total}
          isLimit={config.isLimit}
          isBuySide={config.isBuySide}
          formik={config.formik}
        />
        <SubmitButton
          isBuySide={config.isBuySide}
          formik={config.formik}
          asset={config.assetDetails?.base ?? ""}
        />
      </Box>
    </form>
  );
};

export default Contents;
