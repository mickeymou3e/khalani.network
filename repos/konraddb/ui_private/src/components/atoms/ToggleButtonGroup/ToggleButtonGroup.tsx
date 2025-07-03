import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";

interface ValuesProps {
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
}: ToggleGroupProps) => (
  <ToggleButtonGroup
    value={currentValue}
    onChange={handleAction}
    aria-label="text alignment"
    {...rest}
  >
    {values.map(({ value, label, icon, disabled }) => {
      const Icon = icon;
      return (
        <ToggleButton
          value={value}
          aria-label={label}
          key={`element-${label}`}
          sx={toggleButtonStyles}
          disabled={disabled}
        >
          {icon && <Icon />}
          {label}
        </ToggleButton>
      );
    })}
  </ToggleButtonGroup>
);

export default ToggleGroup;
