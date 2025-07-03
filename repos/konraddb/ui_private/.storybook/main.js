const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next",
    "storybook-react-i18next",
    "storybook-addon-fetch-mock",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  typescript: {
    reactDocgen: "none",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      "@": path.resolve(__dirname, "../src/"),
      "@/public": path.resolve(__dirname, "../public/"),
      "@/components": path.resolve(__dirname, "../src/components/"),
      "@/features": path.resolve(__dirname, "../src/features/"),
      "@/definitions": path.resolve(__dirname, "../src/definitions/"),
      "@/hooks": path.resolve(__dirname, "../src/hooks/"),
      "@/pages": path.resolve(__dirname, "../src/pages/"),
      "@/refi": path.resolve(__dirname, "../src/refi/"),
      "@/services": path.resolve(__dirname, "../src/services/"),
      "@/store": path.resolve(__dirname, "../src/store/"),
      "@/styles": path.resolve(__dirname, "../src/styles/"),
      "@/utils": path.resolve(__dirname, "../src/utils/"),
      "next/font/google": require.resolve(
        "next/dist/build/jest/__mocks__/nextFontMock.js"
      ),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};
