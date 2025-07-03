import React, { ForwardedRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFormatCustomProps extends NumericFormatProps {
  inputRef: ForwardedRef<HTMLInputElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const NumberFormatCustom: React.FC<NumberFormatCustomProps> = ({
  inputRef,
  onChange,
  ...other
}) => {
  const handleChange = (values: any) => {
    const event = {
      target: {
        name: other.name ?? "",
        value: values.formattedValue,
      },
    };
    onChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  const isAllowed = (values: { value: string }) => !values.value.includes("-");

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={handleChange}
      thousandSeparator={false}
      isAllowed={isAllowed}
      decimalSeparator="."
      valueIsNumericString
    />
  );
};

export default NumberFormatCustom;
