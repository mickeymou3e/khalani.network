import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  assignedAssetsMock,
  createMockApiInitialState,
  createMockAuthStore,
  createMockUiInitialState,
  createMockWalletStore,
  custodyWalletMock,
  jltRateMock,
  ordersMock,
  tradedBalancesMock,
  userProfileMock,
} from "@/definitions/__mocks__";
import { AssetName } from "@/definitions/config";
import { FiatCurrencies, OrderType } from "@/definitions/types";
import { setupStore } from "@/store/store";

import OrderEntryTicket from "./OrderEntryTicket";

export default {
  title: "components/features/TradePage/OrderEntryTicket",
  component: OrderEntryTicket,
} as ComponentMeta<typeof OrderEntryTicket>;

const MockStore = ({
  children,
  loggedIn,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
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
      orderType: OrderType.LIMIT,
    }),
    api: createMockApiInitialState({
      userProfile: loggedIn ? userProfileMock : {},
      custodyWallets: loggedIn ? custodyWalletMock : [],
      assignedAssets: loggedIn ? assignedAssetsMock : [],
      balances: loggedIn ? tradedBalancesMock : [],
      orders: loggedIn ? ordersMock : [],
      rates: {
        [AssetName["JLT-F23"]]: loggedIn ? jltRateMock : {},
      },
    }),
    wallet: createMockWalletStore({
      cryptoDepositAddresses: loggedIn ? custodyWalletMock : [],
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof OrderEntryTicket> = () => (
  <OrderEntryTicket />
);

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
LoggedOut.decorators = [
  (story) => <MockStore loggedIn={false}>{story()}</MockStore>,
];

export const LoggedIn = Template.bind({});
LoggedIn.args = {};
LoggedIn.decorators = [(story) => <MockStore loggedIn>{story()}</MockStore>];
