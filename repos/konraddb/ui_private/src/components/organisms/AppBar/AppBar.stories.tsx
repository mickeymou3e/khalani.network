import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import {
  createMockApiInitialState,
  createMockUiInitialState,
  userProfileMock,
} from "@/definitions/__mocks__";
import { AccountPageTabs, UserRole } from "@/definitions/types";
import { setupStore } from "@/store";

import AppBar from "./AppBar";
import { AppBarProps, MainMenuItemProps } from "./types";

const AppBarStories = (props: AppBarProps) => <AppBar {...props} />;

export default {
  title: "components/organisms/AppBar",
  component: AppBarStories,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<AppBarProps>;

const MockStore = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore({
    ui: createMockUiInitialState({
      account: {
        activeTab: AccountPageTabs.profile,
      },
    }),
    api: createMockApiInitialState({
      userProfile: { ...userProfileMock, role: UserRole.Admin },
    }),
  });

  return <Provider store={store}>{children}</Provider>;
};

const Template: Story<AppBarProps> = (args) => <AppBarStories {...args} />;

const menuArgs = {
  onMainMenuItemSelect: (value: MainMenuItemProps) => {
    action("Main menu item selected")(value);
  },
  onHamburgerMenuSelect: (values: string[]) => {
    action("Hamburger menu item selected")(values);
  },
  onLoginClick: action("Login clicked"),
  onSignUpClick: action("Signup clicked"),
};

const routeParams = {
  nextRouter: {
    path: "/markets",
    asPath: "/markets",
    route: "/markets",
    query: {
      id: "/markets",
    },
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  loggedIn: false,
  ...menuArgs,
};
LoggedOut.parameters = {
  ...routeParams,
};
LoggedOut.decorators = [(story) => <MockStore>{story()}</MockStore>];

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  loggedIn: true,
  ...menuArgs,
};
LoggedIn.parameters = {
  ...routeParams,
};
LoggedIn.decorators = [(story) => <MockStore>{story()}</MockStore>];
