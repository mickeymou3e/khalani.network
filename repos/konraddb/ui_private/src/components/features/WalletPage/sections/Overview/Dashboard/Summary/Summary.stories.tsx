import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
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

import Summary from "./Summary";

export default {
  title: "components/features/WalletPage/Overview/Summary",
  component: Summary,
} as ComponentMeta<typeof Summary>;

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

const Template: ComponentStory<typeof Summary> = () => (
  <Summary setSelectedTab={action("clicked")} />
);

export const NoBalances = Template.bind({});
NoBalances.decorators = [
  (story) => <MockStore withData={false}>{story()}</MockStore>,
];

export const WithBalances = Template.bind({});
WithBalances.args = {};
WithBalances.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const WithBalancesHiddenValues = Template.bind({});
WithBalancesHiddenValues.decorators = [
  (story) => <MockStore hideValues>{story()}</MockStore>,
];
