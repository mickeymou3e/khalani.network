import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  apiTokensMock,
  createMockApiInitialState,
} from "@/definitions/__mocks__";
import { setupStore } from "@/store";

import ApiKeysList from "./ApiKeysList";

export default {
  title: "components/features/AccountPage/sections/ApiKeys/ApiKeysList",
  component: ApiKeysList,
} as ComponentMeta<typeof ApiKeysList>;

const MockStore = ({
  children,
  empty = false,
}: {
  children: React.ReactNode;
  empty?: boolean;
}) => {
  const store = setupStore({
    api: createMockApiInitialState({
      apiTokens: empty ? [] : apiTokensMock,
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof ApiKeysList> = () => (
  <ApiKeysList handleAddNewApiKey={action("addNewApiKey")} />
);

export const EmptyList = Template.bind({});
EmptyList.args = {};
EmptyList.decorators = [(story) => <MockStore empty>{story()}</MockStore>];

export const Populated = Template.bind({});
Populated.args = {};
Populated.decorators = [(story) => <MockStore>{story()}</MockStore>];
