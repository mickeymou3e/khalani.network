import { Provider } from "react-redux";
import { Meta, Story } from "@storybook/react";

import {
  assignedAssetsMock,
  atomRateMock,
  balancesMock,
  btcRateMock,
  createJasmineMockApiInitialState,
  createMockApiInitialState,
  createMockAuthStore,
  createMockUiInitialState,
  ethRateMock,
  jltRateMock,
} from "@/definitions/__mocks__";
import {
  jasminePoolDepositsMock,
  jasmineTokenMetadataMock,
} from "@/definitions/__mocks__/pool.mock";
import { AssetName } from "@/definitions/config";
import { setupStore } from "@/store/store";

import { MarketsPage } from "./MarketsPage";

export default {
  title: "components/features/MarketsPage",
  component: MarketsPage,
} as Meta<typeof MarketsPage>;

enum StoryViews {
  LoggedOut = "LoggedOut",
  LoggedIn = "LoggedIn",
}

const MockStore = ({
  view = StoryViews.LoggedOut,
  children,
}: {
  view: StoryViews;
  children: React.ReactNode;
}) => {
  const isLoggedIn = view === StoryViews.LoggedIn;
  const isLoggedOut = view === StoryViews.LoggedOut;

  const store = setupStore({
    ui: createMockUiInitialState({
      base: "BTC",
      quote: "EUR",
    }),
    auth: createMockAuthStore({
      csrfToken: isLoggedIn ? "token" : "",
      wsToken: isLoggedIn ? "token" : "",
      isFullyLoggedIn: isLoggedIn,
    }),
    api: createMockApiInitialState({
      assignedAssets: isLoggedIn ? assignedAssetsMock : [],
      balances: isLoggedIn ? balancesMock : [],
      rates: {
        BTC: isLoggedIn ? btcRateMock : {},
        ETH: isLoggedIn ? ethRateMock : {},
        ATOM: isLoggedIn ? atomRateMock : {},
        [AssetName["JLT-F23"]]: jltRateMock,
      },
    }),
    jasmineApi: createJasmineMockApiInitialState({
      tokenMetadata: isLoggedOut || isLoggedIn ? jasmineTokenMetadataMock : [],
      poolDeposits: isLoggedOut || isLoggedIn ? jasminePoolDepositsMock : [],
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: Story<typeof MarketsPage> = (args) => <MarketsPage {...args} />;

export const LoggedOutView = Template.bind({});
LoggedOutView.args = {};
LoggedOutView.decorators = [
  (story) => <MockStore view={StoryViews.LoggedOut}>{story()}</MockStore>,
];

export const LoggedInView = Template.bind({});
LoggedInView.args = {};
LoggedInView.decorators = [
  (story) => <MockStore view={StoryViews.LoggedIn}>{story()}</MockStore>,
];
