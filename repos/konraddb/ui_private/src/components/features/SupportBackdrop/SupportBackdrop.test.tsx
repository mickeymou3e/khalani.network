import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import { checkScreenTexts } from "@/utils/testUtils";

import * as stories from "./SupportBackdrop.stories";

const { InitialPage, InitialPageStaticSubject, SuccessPage } =
  composeStories(stories);

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SupportBackdrop", () => {
  test("InitialPage render", () => {
    render(<InitialPage />);

    checkScreenTexts([
      "Contact Support",
      "Please provide detailed information about the issue you are facing or the specific question you have.",
      "Email",
      "Subject",
      "Message",
      "Send",
      "Cancel",
    ]);
    expect(screen.queryByDisplayValue("Static Value")).not.toBeInTheDocument();
  });

  test("InitialPageStaticSubject render", () => {
    render(<InitialPageStaticSubject />);

    expect(screen.queryByDisplayValue("Static Value")).toBeInTheDocument();
  });

  test("InitialPage render", () => {
    render(<SuccessPage />);

    checkScreenTexts([
      "Message sent",
      "Our support team will contact you via email within the next 24 hours.",
      "Close",
    ]);
  });
});
