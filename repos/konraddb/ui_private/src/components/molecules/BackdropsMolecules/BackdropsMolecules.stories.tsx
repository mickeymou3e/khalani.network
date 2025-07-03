import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Box from "@mui/material/Box";

import { SilentGuy } from "@/components/atoms";
import {
  createMockAuthStore,
  createMockBackdropsStore,
} from "@/definitions/__mocks__";
import { setupStore } from "@/store/store";

import { AuthDisclaimer } from "./AuthDisclaimer";
import { BackdropTitle } from "./BackdropTitle";
import {
  FailureBackdropView,
  FailureBackdropViewProps,
} from "./FailureBackdropView";
import { GrayTextWrapper, GrayTextWrapperProps } from "./GrayTextWrapper";
import { ResultBackdropView } from "./ResultBackdropView";

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    backdrops: createMockBackdropsStore({}),
    auth: createMockAuthStore({}),
  });

  return <Provider store={store}>{children}</Provider>;
};

const FirstViewWrapper = () => (
  <Box mx="auto" width={480}>
    <AuthDisclaimer />
  </Box>
);
const SecondViewWrapper = () => (
  <Box mx="auto" width={480}>
    <BackdropTitle
      title="Title"
      subtitle="Subtitle of the backdrop"
      handleGetBack={() => console.log("action clicked")}
    />
  </Box>
);
const ThirdViewWrapper = () => (
  <Box mx="auto" width={480}>
    <ResultBackdropView
      title="Title"
      subtitle="Subtitle of the backdrop"
      primaryButtonLabel="primary button"
      secondaryButtonLabel="secondary button"
      icon={<SilentGuy />}
    />
  </Box>
);
const FailureViewWrapper = (args: FailureBackdropViewProps) => (
  <Box mx="auto" width={480}>
    <FailureBackdropView {...args} />
  </Box>
);

const GrayTextWrapperBox = (args: GrayTextWrapperProps) => (
  <Box mx="auto" width={480}>
    <GrayTextWrapper {...args} />
  </Box>
);

export default {
  title: "components/molecules/BackdropsMolecules",
  component: FirstViewWrapper,
} as ComponentMeta<typeof FirstViewWrapper>;

// --------------------------------------------------
const FirstViewTemplate: ComponentStory<typeof AuthDisclaimer> = () => (
  <FirstViewWrapper />
);
export const BackdropAuthDisclaimer = FirstViewTemplate.bind({});
BackdropAuthDisclaimer.args = {};
BackdropAuthDisclaimer.decorators = [
  (story) => <MockStore>{story()}</MockStore>,
];
// --------------------------------------------------
const SecondViewTemplate: ComponentStory<typeof BackdropTitle> = () => (
  <SecondViewWrapper />
);
export const BackdropCommonTitle = SecondViewTemplate.bind({});
BackdropCommonTitle.args = {};
BackdropCommonTitle.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const ThirdViewTemplate: ComponentStory<typeof ResultBackdropView> = () => (
  <ThirdViewWrapper />
);
export const SuccessView = ThirdViewTemplate.bind({});
SuccessView.args = {};
SuccessView.decorators = [(story) => <MockStore>{story()}</MockStore>];
// --------------------------------------------------
const FailureViewTemplate: ComponentStory<typeof FailureBackdropView> = (
  args
) => <FailureViewWrapper {...args} />;
export const FailureView = FailureViewTemplate.bind({});
FailureView.args = {};
FailureView.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const FailureViewCustomLabels = FailureViewTemplate.bind({});
FailureViewCustomLabels.args = {
  title: "Title",
  subtitle: "Subtitle of the backdrop",
  primaryButton: {
    label: "custom primary label",
    action: action("primary button clicked"),
  },
  secondaryButton: {
    label: "custom secondary label",
    action: action("secondary button clicked"),
  },
};
FailureViewCustomLabels.decorators = [
  (story) => <MockStore>{story()}</MockStore>,
];
// --------------------------------------------------
const GrayTextWrapperBoxTemplate: ComponentStory<typeof GrayTextWrapper> = (
  args
) => <GrayTextWrapperBox {...args} />;
export const GrayTextWrapperView = GrayTextWrapperBoxTemplate.bind({});
GrayTextWrapperView.args = {
  content: ["content1", "content2", "content3"],
};
GrayTextWrapperView.decorators = [(story) => <MockStore>{story()}</MockStore>];
