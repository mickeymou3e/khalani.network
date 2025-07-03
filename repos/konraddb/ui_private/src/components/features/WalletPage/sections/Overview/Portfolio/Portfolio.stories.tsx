import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  assignedAssetsMock,
  createMockApiInitialState,
  createMockUiInitialState,
  createMockWalletStore,
  custodyWalletMock,
  jltRateMock,
  tradedBalancesMock,
  userProfileMock,
} from "@/definitions/__mocks__";
import { AssetName } from "@/definitions/config";
import { setupStore } from "@/store";

import Portfolio from "./Portfolio";

export default {
  title: "components/features/WalletPage/Overview/Portfolio",
  component: Portfolio,
} as ComponentMeta<typeof Portfolio>;

const MockStore = ({
  children,
  withData = true,
  hideValues = false,
}: {
  children: React.ReactNode;
  withData?: boolean;
  hideValues?: boolean;
}) => {
  const store = setupStore({
    ui: createMockUiInitialState({
      wallet: {
        hideValues,
      },
    }),
    api: createMockApiInitialState({
      userProfile: withData ? userProfileMock : {},
      custodyWallets: withData ? custodyWalletMock : [],
      assignedAssets: withData ? assignedAssetsMock : [],
      balances: withData ? tradedBalancesMock : [],
      rates: {
        [AssetName["JLT-F23"]]: withData ? jltRateMock : {},
      },
    }),
    wallet: createMockWalletStore({
      cryptoDepositAddresses: withData ? custodyWalletMock : [],
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof Portfolio> = () => <Portfolio />;

export const NoPortfolio = Template.bind({});
NoPortfolio.decorators = [
  (story) => <MockStore withData={false}>{story()}</MockStore>,
];

export const WithPortfolio = Template.bind({});
WithPortfolio.args = {};
WithPortfolio.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const WithPortfolioHiddenValues = Template.bind({});
WithPortfolioHiddenValues.decorators = [
  (story) => <MockStore hideValues>{story()}</MockStore>,
];
