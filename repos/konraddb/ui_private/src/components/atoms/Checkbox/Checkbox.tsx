import { Checkbox as MuiCheckbox,FormControlLabel } from "@mui/material";

import { containerStyle } from "./Checkbox.styles";
import { CheckboxProps, LabelPlacement } from "./types";

const Checkbox = ({
  label = "",
  labelPlacement = LabelPlacement.end,
  ...rest
}: CheckboxProps) => {
  if (!label) return <MuiCheckbox {...rest} />;

  return (
    <FormControlLabel
      sx={containerStyle}
      label={label}
      labelPlacement={labelPlacement}
      control={<MuiCheckbox {...rest} />}
    />
  );
};

export default Checkbox;
