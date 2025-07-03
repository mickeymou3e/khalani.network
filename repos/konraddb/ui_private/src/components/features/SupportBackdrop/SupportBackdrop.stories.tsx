import { Provider } from "react-redux";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { createMockBackdropsStore } from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import SupportBackdrop from "./SupportBackdrop";
import { SupportBackdropSections } from "./useSupportBackdropContents";

export default {
  title: "components/features/SupportBackdrop",
  component: SupportBackdrop,
} as ComponentMeta<typeof SupportBackdrop>;

const MockStore = ({
  children,
  subject = "",
}: {
  children: React.ReactNode;
  subject?: string;
}) => {
  const store = setupStore({
    backdrops: createMockBackdropsStore({
      parameters: subject,
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: ComponentStory<typeof SupportBackdrop> = (args) => (
  <SupportBackdrop {...args} />
);

export const InitialPage = Template.bind({});
InitialPage.args = {
  initialSection: SupportBackdropSections.Main,
};
InitialPage.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const InitialPageStaticSubject = Template.bind({});
InitialPageStaticSubject.args = {
  initialSection: SupportBackdropSections.Main,
};
InitialPageStaticSubject.decorators = [
  (story) => <MockStore subject="Static Value">{story()}</MockStore>,
];

export const SuccessPage = Template.bind({});
SuccessPage.args = {
  initialSection: SupportBackdropSections.Success,
};
SuccessPage.decorators = [(story) => <MockStore>{story()}</MockStore>];
