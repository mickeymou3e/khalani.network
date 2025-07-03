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

import PieChart from "./PieChart";

export default {
  title: "components/features/WalletPage/Overview/PieChart",
  component: PieChart,
} as ComponentMeta<typeof PieChart>;

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

const Template: ComponentStory<typeof PieChart> = () => <PieChart />;

export const Populated = Template.bind({});
Populated.args = {};
Populated.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const PopulatedHiddenValues = Template.bind({});
PopulatedHiddenValues.args = {};
PopulatedHiddenValues.decorators = [
  (story) => <MockStore hideValues>{story()}</MockStore>,
];

export const Empty = Template.bind({});
Empty.args = {};
Empty.decorators = [
  (story) => <MockStore withData={false}>{story()}</MockStore>,
];
