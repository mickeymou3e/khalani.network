// jest.config.js
module.exports = {
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/*.stories.tsx",
    "!**/*.api.ts",
    "!**/*.styles.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/*mock*.{ts,tsx}",
    "!**/index.{ts,tsx}",
    "!**/public/**",
    "!**/charting_library/**",
    "!**/src/store/store.ts",
    "!**/src/utils/testUtils.ts",
    "!**/src/pages/**",
    "!**/*Page.tsx",
    "!**/src/styles/**",
    "!**/src/hooks/**",
    "!**/src/components/atoms/CustomIcons/**",
  ],
  collectCoverage: false,
  moduleNameMapper: {
    "^@/public/(.*)$": "<rootDir>/public/$1",
    "^@/components(.*)$": "<rootDir>/src/components$1",
    "^@/features(.*)$": "<rootDir>/src/features$1",
    "^@/definitions(.*)$": "<rootDir>/src/definitions$1",
    "^@/hooks(.*)$": "<rootDir>/src/hooks$1",
    "^@/pages(.*)$": "<rootDir>/src/pages$1",
    "^@/services(.*)$": "<rootDir>/src/services$1",
    "^@/store(.*)$": "<rootDir>/src/store$1",
    "^@/styles(.*)$": "<rootDir>/src/styles$1",
    "^@/utils(.*)$": "<rootDir>/src/utils$1",
    "@config": "<rootDir>/config.ts",
    "\\.css$": "<rootDir>/src/definitions/__mocks__/style.mock.ts",
    "next/font/(.*)": require.resolve(
      "next/dist/build/jest/__mocks__/nextFontMock.js"
    ),
  },
  setupFiles: ["<rootDir>/jest.setup.env.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/public/",
  ],
  testEnvironment: "jsdom",
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};
