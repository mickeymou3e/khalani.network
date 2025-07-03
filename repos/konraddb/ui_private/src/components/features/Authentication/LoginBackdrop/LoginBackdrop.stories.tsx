import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import {
  createMockAuthStore,
  createMockBackdropsStore,
} from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import { backdropWrapper } from "./LoginBackdrop.styles";
import BlockedView from "./sections/BlockedView";
import MainView from "./sections/MainView";
import VerifyView from "./sections/VerifyView";

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    backdrops: createMockBackdropsStore({}),
    auth: createMockAuthStore({}),
  });

  return <Provider store={store}>{children}</Provider>;
};

const FirstViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <MainView setView={action("clicked")} />
  </Box>
);
const SecondViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <VerifyView setView={action("clicked")} />
  </Box>
);
const FourthViewWrapper = () => (
  <Box sx={backdropWrapper}>
    <BlockedView handleResetPassword={action("clicked")} />
  </Box>
);

export default {
  title: "components/features/Authentication/LoginBackdrop",
  component: FirstViewWrapper,
} as ComponentMeta<typeof FirstViewWrapper>;

// --------------------------------------------------
const FirstViewTemplate: ComponentStory<typeof MainView> = () => (
  <FirstViewWrapper />
);
export const BackdropFirstView = FirstViewTemplate.bind({});
BackdropFirstView.args = {};
BackdropFirstView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const SecondViewTemplate: ComponentStory<typeof VerifyView> = () => (
  <SecondViewWrapper />
);
export const BackdropSecondView = SecondViewTemplate.bind({});
BackdropSecondView.args = {};
BackdropSecondView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const FourthViewTemplate: ComponentStory<typeof BlockedView> = () => (
  <FourthViewWrapper />
);
export const BackdropFourthView = FourthViewTemplate.bind({});
BackdropFourthView.args = {};
BackdropFourthView.decorators = [(story) => <MockStore>{story()}</MockStore>];
