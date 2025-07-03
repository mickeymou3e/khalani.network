import { Provider } from "react-redux";
import { Meta, Story } from "@storybook/react";

import {
  assignedAssetsMock,
  atomRateMock,
  balancesMock,
  btcRateMock,
  createMockApiInitialState,
  createMockUiInitialState,
  ethRateMock,
  jltRateMock,
} from "@/definitions/__mocks__";
import { AssetName } from "@/definitions/config";
import { setupStore } from "@/store/store";

import AssetSelect from "./AssetSelect";

export default {
  title: "components/organisms/AssetSelect",
  component: AssetSelect,
} as Meta<typeof AssetSelect>;

const MockStore = ({
  withData,
  children,
}: {
  withData?: boolean;
  children: React.ReactNode;
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
        ATOM: withData ? atomRateMock : {},
        [AssetName["JLT-F23"]]: withData ? jltRateMock : {},
      },
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: Story<typeof AssetSelect> = (args) => <AssetSelect {...args} />;

export const EmptyView = Template.bind({});
EmptyView.args = {};
EmptyView.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const DetailedView = Template.bind({});
DetailedView.args = {};
DetailedView.decorators = [
  (story) => <MockStore withData>{story()}</MockStore>,
];
