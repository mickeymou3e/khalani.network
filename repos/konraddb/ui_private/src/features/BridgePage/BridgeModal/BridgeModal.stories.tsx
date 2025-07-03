import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Box } from "@mui/material";

import { createMockUiInitialState } from "@/definitions/__mocks__";
import { ModalVariants } from "@/definitions/types";
import { setupStore } from "@/store";

import BridgeModal, { BridgeModalViews } from "./BridgeModal";

export default {
  title: "features/BridgePage/BridgeModal",
  component: BridgeModal,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof BridgeModal>;

const MockStore = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: BridgeModalViews;
}) => {
  const store = setupStore({
    ui: createMockUiInitialState({
      modal: {
        variant: ModalVariants.Bridge,
        params,
      },
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof BridgeModal> = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <BridgeModal />
  </Box>
);

export const BridgingIn = Template.bind({});
BridgingIn.args = {};
BridgingIn.decorators = [
  (story) => (
    <MockStore params={BridgeModalViews.BridgingIn}>{story()}</MockStore>
  ),
];

export const BridgeInSuccess = Template.bind({});
BridgeInSuccess.args = {};
BridgeInSuccess.decorators = [
  (story) => (
    <MockStore params={BridgeModalViews.BridgeInSuccess}>{story()}</MockStore>
  ),
];

export const BridgeOutSuccess = Template.bind({});
BridgeOutSuccess.args = {};
BridgeOutSuccess.decorators = [
  (story) => (
    <MockStore params={BridgeModalViews.BridgeOutSuccess}>{story()}</MockStore>
  ),
];

export const BridgeFailed = Template.bind({});
BridgeFailed.args = {};
BridgeFailed.decorators = [
  (story) => (
    <MockStore params={BridgeModalViews.BridgeFailed}>{story()}</MockStore>
  ),
];
