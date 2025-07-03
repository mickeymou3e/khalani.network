import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

import i18n from "./i18next.js";
import { withMuiTheme } from "./withMuiTheme";

export const decorators = [withMuiTheme];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: { disable: true },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  i18n,
  locale: "en",
  locales: {
    en: "English",
    de: "German",
  },
  fetchMock: {
    debug: true,
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [
        { value: "light", left: "☀️", title: "Light mode" },
        { value: "dark", left: "🌙", title: "Dark mode" },
      ],
    },
  },
};
