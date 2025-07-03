import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import { Button } from "@/components/atoms";
import { ExecutionSide } from "@/definitions/types";

import { namespace, sideNamespace } from "../../config";
import { OrderFormProps } from "../Contents.types";

type SubmitButtonProps = {
  formik: FormikProps<OrderFormProps>;
  isBuySide: boolean;
  asset: string;
};

const SubmitButton = ({ isBuySide, formik, asset }: SubmitButtonProps) => {
  const { t } = useTranslation([namespace, sideNamespace]);
  const buttonVariant = isBuySide ? "long" : "short";
  const side = isBuySide ? ExecutionSide.BUY : ExecutionSide.SELL;
  const sideLabel = t(`${sideNamespace}:${side}`);
  const buttonLabel = `${sideLabel} ${asset ?? ""}`;
  const buttonDisabled =
    !formik.isValid || formik.isSubmitting || !formik.dirty;

  return (
    <Button
      onClick={formik.submitForm}
      variant={buttonVariant}
      disabled={buttonDisabled}
      size="large"
    >
      {buttonLabel}
    </Button>
  );
};

export default SubmitButton;
