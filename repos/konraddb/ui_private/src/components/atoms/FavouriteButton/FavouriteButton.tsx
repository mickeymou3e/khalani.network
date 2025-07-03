import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import {
  ToggleButton,
  ToggleButtonProps as MuiToggleButtonProps,
} from "@mui/material";

import { buttonStyle } from "./FavouriteButton.styles";

export type FavouriteButtonProps = Omit<MuiToggleButtonProps, "value">;

const FavouriteButton = ({ selected, ...rest }: FavouriteButtonProps) => (
  <ToggleButton
    sx={buttonStyle}
    size="large"
    value="check"
    selected={selected}
    {...rest}
  >
    {selected ? <StarOutlinedIcon /> : <StarOutlineOutlinedIcon />}
  </ToggleButton>
);

export default FavouriteButton;
