import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import { createMockBackdropsStore } from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import { backdropWrapper } from "./RequestWithdrawalBackdrop.styles";
import ErrorView from "./sections/ErrorView";
import SuccessView from "./sections/SuccessView";
import VerifyView from "./sections/VerifyView";

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    backdrops: createMockBackdropsStore({}),
  });

  return <Provider store={store}>{children}</Provider>;
};

const FirstViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <VerifyView setView={action("clicked")} />
  </Box>
);
const SecondViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <SuccessView />
  </Box>
);
const ThirdViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <ErrorView setView={action("clicked")} />
  </Box>
);

export default {
  title: "components/features/WalletPage/RequestWithdrawalBackdrop",
  component: FirstViewWrapper,
} as ComponentMeta<typeof FirstViewWrapper>;

// --------------------------------------------------
const FirstViewTemplate: ComponentStory<typeof VerifyView> = () => (
  <FirstViewWrapper />
);
export const BackdropFirstView = FirstViewTemplate.bind({});
BackdropFirstView.args = {};
BackdropFirstView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const SecondViewTemplate: ComponentStory<typeof SuccessView> = () => (
  <SecondViewWrapper />
);
export const BackdropSecondView = SecondViewTemplate.bind({});
BackdropSecondView.args = {};
BackdropSecondView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const ThirdViewTemplate: ComponentStory<typeof SuccessView> = () => (
  <ThirdViewWrapper />
);
export const BackdropThirdView = ThirdViewTemplate.bind({});
BackdropThirdView.args = {};
BackdropThirdView.decorators = [(story) => <MockStore>{story()}</MockStore>];
