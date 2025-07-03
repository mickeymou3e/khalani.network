import { Provider } from "react-redux";
import { Meta, Story } from "@storybook/react";

import {
  assignedAssetsMock,
  balancesMock,
  btcRateMock,
  createMockApiInitialState,
  createMockUiInitialState,
  ethRateMock,
} from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import SelectedAssetPrices from "./SelectedAssetPrices";

export default {
  title: "components/features/TradePage/TopBar/SelectedAssetPrices",
  component: SelectedAssetPrices,
} as Meta<typeof SelectedAssetPrices>;

const MockStore = ({
  children,
  withData,
}: {
  children: React.ReactNode;
  withData: boolean;
}) => {
  const store = setupStore({
    ui: createMockUiInitialState({
      base: "BTC",
      quote: "EUR",
    }),
    api: createMockApiInitialState({
      assignedAssets: withData ? assignedAssetsMock : [],
      balances: withData ? balancesMock : [],
      rates: {
        BTC: withData ? btcRateMock : {},
        ETH: withData ? ethRateMock : {},
      },
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: Story<typeof SelectedAssetPrices> = (args) => (
  <SelectedAssetPrices {...args} />
);

export const NoPrices = Template.bind({});
NoPrices.args = {};
NoPrices.decorators = [
  (story) => <MockStore withData={false}>{story()}</MockStore>,
];

export const WithPrices = Template.bind({});
WithPrices.args = {};
WithPrices.decorators = [(story) => <MockStore withData>{story()}</MockStore>];
