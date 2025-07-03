import Image from "next/image";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";

export interface ValuesProps {
  value: string | number;
  label: string;
  icon?: any;
  disabled?: boolean;
}

export interface ToggleGroupProps extends ToggleButtonGroupProps {
  handleAction: (_: unknown, value: string) => void;
  currentValue: string | null;
  values: ValuesProps[];
  toggleButtonStyles?: any;
}

const ToggleGroup = ({
  handleAction,
  currentValue,
  values,
  toggleButtonStyles,
  ...rest
}: ToggleGroupProps) => {
  const onChange = (_: unknown, value: string) => {
    if (!value) return;
    handleAction(_, value);
  };

  return (
    <ToggleButtonGroup
      value={currentValue}
      onChange={onChange}
      aria-label="text alignment"
      exclusive
      {...rest}
    >
      {values.map(({ value, label, icon, disabled }) => (
        <ToggleButton
          value={value}
          aria-label={label}
          key={`element-${label}`}
          sx={toggleButtonStyles}
          disabled={disabled}
        >
          {icon && (
            <Image
              src={icon.toLowerCase()}
              alt={label || ""}
              width={24}
              height={24}
              style={{ marginRight: 8 }}
            />
          )}
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleGroup;
