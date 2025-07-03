import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { setupStore } from "@/store";

import RegisterPage from "./RegisterPage";
import { RegisterViews } from "./useRegisterPage";

export default {
  title: "components/features/Authentication/RegisterPage",
  component: RegisterPage,
} as ComponentMeta<typeof RegisterPage>;

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({});

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof RegisterPage> = (args) => (
  <RegisterPage {...args} />
);

export const Signup = Template.bind({});
Signup.args = {
  view: RegisterViews.Main,
};
Signup.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const TwoFA = Template.bind({});
TwoFA.args = {
  view: RegisterViews.TwoFA,
};
TwoFA.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const Completed = Template.bind({});
Completed.args = {
  view: RegisterViews.Completed,
};
Completed.decorators = [(story) => <MockStore>{story()}</MockStore>];
