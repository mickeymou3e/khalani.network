import { Inter } from "next/font/google";

import { ThemeModes } from "@/types/theme";
import { createTheme } from "@/styles/theme";

// Inter is a variable font, no need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const lightTheme = createTheme(ThemeModes.light, inter.style.fontFamily);
export const darkTheme = createTheme(ThemeModes.dark, inter.style.fontFamily);
