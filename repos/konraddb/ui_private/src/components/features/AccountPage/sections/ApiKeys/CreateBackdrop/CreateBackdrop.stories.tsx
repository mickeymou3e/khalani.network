import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  createMockAuthStore,
  createMockBackdropsStore,
} from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import CreateBackdrop from "./CreateBackdrop";
import { CreateBackdropViews } from "./useCreateBackdrop";

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    backdrops: createMockBackdropsStore({}),
    auth: createMockAuthStore({}),
  });

  return <Provider store={store}>{children}</Provider>;
};

export default {
  title: "components/features/AccountPage/sections/ApiKeys/CreateBackdrop",
  component: CreateBackdrop,
} as ComponentMeta<typeof CreateBackdrop>;

const Template: ComponentStory<typeof CreateBackdrop> = (args) => (
  <CreateBackdrop {...args} />
);

export const MainView = Template.bind({});
MainView.args = {
  initialView: CreateBackdropViews.Main,
};
MainView.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const SuccessView = Template.bind({});
SuccessView.args = {
  initialView: CreateBackdropViews.Success,
};
SuccessView.decorators = [(story) => <MockStore>{story()}</MockStore>];
