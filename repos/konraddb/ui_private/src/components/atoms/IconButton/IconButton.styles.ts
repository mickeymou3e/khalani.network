import { ButtonSizes } from "./IconButton";

const createDimensions = (buttonSize: string, iconSize: string) => ({
  width: buttonSize,
  minWidth: buttonSize,
  height: buttonSize,
  minHeight: buttonSize,
  borderRadius: "50%",
  padding: 0,

  "& > svg": {
    width: iconSize,
    height: iconSize,
  },
});

export const buttonStyle = (size?: string) => () => {
  const dimensions = {
    [ButtonSizes.large]: createDimensions("4rem", "1.5rem"),
    [ButtonSizes.medium]: createDimensions("3rem", "1.25rem"),
    [ButtonSizes.small]: createDimensions("2rem", "1rem"),
  };

  return size ? dimensions[size as ButtonSizes] : {};
};
