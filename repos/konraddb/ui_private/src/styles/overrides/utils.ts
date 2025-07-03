import { alpha } from "@mui/material";

export const colorify = (color = "", bgColor = "", opacity = 1) => {
  if (!bgColor) return { color };

  const calculatedBgColor = opacity < 1 ? alpha(bgColor, opacity) : bgColor;

  return !color
    ? { backgroundColor: calculatedBgColor }
    : { color, backgroundColor: calculatedBgColor };
};
