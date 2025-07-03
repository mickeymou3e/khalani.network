import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  assignedAssetsMock,
  createMockApiInitialState,
  createMockAuthStore,
  createMockUiInitialState,
  createMockWalletStore,
  custodyWalletMock,
  ordersMock,
  tradedBalancesMock,
  userProfileMock,
} from "@/definitions/__mocks__";
import { AssetName } from "@/definitions/config";
import { FiatCurrencies, UserRole } from "@/definitions/types";
import { setupStore } from "@/store/store";

import Holdings from "./Holdings";

export default {
  title: "components/features/TradePage/Holdings",
  component: Holdings,
} as ComponentMeta<typeof Holdings>;

const MockStore = ({
  children,
  loggedIn,
  withData = false,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
  withData?: boolean;
}) => {
  const store = setupStore({
    auth: createMockAuthStore({
      csrfToken: loggedIn ? "valid csrf token" : "",
      wsToken: loggedIn ? "valid ws token" : "",
      isFullyLoggedIn: loggedIn,
    }),
    ui: createMockUiInitialState({
      base: AssetName["JLT-F23"],
      quote: FiatCurrencies.EUR,
    }),
    api: createMockApiInitialState({
      userProfile: withData ? { ...userProfileMock, role: UserRole.Admin } : {},
      orders: withData ? ordersMock : [],
      custodyWallets: withData ? custodyWalletMock : [],
      assignedAssets: withData ? assignedAssetsMock : [],
      balances: withData ? tradedBalancesMock : [],
    }),
    wallet: createMockWalletStore({
      cryptoDepositAddresses: withData ? custodyWalletMock : [],
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof Holdings> = () => <Holdings />;

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
LoggedOut.decorators = [
  (story) => <MockStore loggedIn={false}>{story()}</MockStore>,
];

export const EmptyLists = Template.bind({});
EmptyLists.args = {};
EmptyLists.decorators = [(story) => <MockStore loggedIn>{story()}</MockStore>];

export const PopulatedLists = Template.bind({});
PopulatedLists.args = {};
PopulatedLists.decorators = [
  (story) => (
    <MockStore loggedIn withData>
      {story()}
    </MockStore>
  ),
];
