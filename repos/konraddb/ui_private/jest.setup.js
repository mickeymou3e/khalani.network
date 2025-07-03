// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { setGlobalConfig } from "@storybook/testing-react";
import "@testing-library/jest-dom/extend-expect";
import * as globalConfig from "./.storybook/preview";
import { TextEncoder, TextDecoder } from "util";

setGlobalConfig(globalConfig);

global.ResizeObserver = require("resize-observer-polyfill");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

require("jest-fetch-mock").enableMocks();
