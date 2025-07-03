import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import { InputBase, InputBaseProps } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

import { inputStyle } from "./NumericInput.styles";

export type NumericInputProps = {
  min?: number;
  max?: number;
  step?: number;
  asset?: string;
  namespace?: string;
  translationOptions?: Record<string, string>;
  formikId: string;
  formik: FormikProps<any>;
} & Omit<InputBaseProps, "type" | "trailingText">;

const NumericInput = ({
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 0.01,
  asset,
  namespace = "",
  translationOptions = {},
  formikId,
  formik,
  placeholder,
  label,
  TopLabelProps,
  ...rest
}: NumericInputProps) => {
  const { t } = useTranslation(namespace);
  const hasError = Boolean(formik.touched[formikId] && formik.errors[formikId]);
  const errorMessage = evaluate(
    [true, ""],
    [hasError, formik.errors[formikId]],
    [
      hasError && namespace,
      t(`${namespace}:${formik.errors[formikId]}`, translationOptions),
    ]
  ) as string;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    (event.target as HTMLElement).blur();

    event.stopPropagation();

    setTimeout(() => {
      (event.target as HTMLElement).focus();
    }, 0);
  };

  return (
    <InputBase
      sx={inputStyle}
      type="number"
      placeholder={placeholder || Symbols.ZeroBalance}
      autoComplete="off"
      InputProps={{
        inputProps: { min, max, step, noValidate: true },
        ...rest.InputProps,
      }}
      TopLabelProps={
        TopLabelProps || {
          LabelProps: { value: label as string },
        }
      }
      BottomLabelProps={{
        LabelProps: {
          value: errorMessage,
        },
      }}
      trailingText={asset}
      error={hasError}
      {...formik.getFieldProps(formikId)}
      {...rest}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
    />
  );
};

export default NumericInput;
