import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import { createMockBackdropsStore } from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import { backdropWrapper } from "./DeleteAddressBackdrop.styles";
import ResultView from "./sections/ResultView";
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

const SecondViewWrapper = ({ isSuccess }: { isSuccess: boolean }) => (
  <Box sx={backdropWrapper}>
    <ResultView isSuccess={isSuccess} />
  </Box>
);
const ThirdViewWrapper = ({ isSuccess }: { isSuccess: boolean }) => (
  <Box sx={backdropWrapper}>
    <ResultView isSuccess={isSuccess} />
  </Box>
);

export default {
  title: "components/features/WalletPage/DeleteAddressBackdrop",
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
const SecondViewTemplate: ComponentStory<typeof ResultView> = (args) => (
  <SecondViewWrapper {...args} />
);
export const BackdropSecondView = SecondViewTemplate.bind({});
BackdropSecondView.args = {
  isSuccess: false,
};
BackdropSecondView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const ThirdViewTemplate: ComponentStory<typeof ResultView> = (args) => (
  <ThirdViewWrapper {...args} />
);
export const BackdropThirdView = ThirdViewTemplate.bind({});
BackdropThirdView.args = {
  isSuccess: true,
};
BackdropThirdView.decorators = [(story) => <MockStore>{story()}</MockStore>];
