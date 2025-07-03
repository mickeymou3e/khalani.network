# Neutral RFQ UI

# Description

[Neutral Overview](https://neutral-protocol.gitbook.io/neutral/UILX3hugp2qxEtH5DLzo/introduction/neutral-overview)

# Breakdown

This application uses a variety of open source packages and tools to ensure a reliable and robust development experience. The main packages and tools used are listed below:

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material UI](https://mui.com/)
- [I18Next](https://github.com/i18next/next-i18next)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Getting Started

Before you can clone and run this application, you'll need to have the following tools installed on your computer:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Installation

Installing and setting up the application is a simple process that can be done in a few steps. Follow the instructions below to get started:

```bash
# Clone this repository using SSH
$ git clone git@github.com:neutral-protocol/rfq-ui.git

# Navigate to the project directory
$ cd rfq-ui

# Install the project dependencies
$ yarn

# Start the development server
$ yarn dev
```

## Storybook

Storybook is a powerful tool that allows you to build and test UI components in isolation. It provides a sandbox environment for your components, allowing you to view and interact with them outside of the context of your application.

To run Storybook, you can use the following commands:

- `yarn storybook` This command starts the Storybook development server, which provides a local environment for viewing and testing your components.

- `yarn build-storybook` This command builds the Storybook static site, which you can deploy to a web server.

Make sure to write clear and concise stories that showcase the functionality and use cases of your components.

## Testing

Testing is an essential part of building a robust and reliable application. You can run the tests using the following commands:

- `yarn test` This command runs all the tests in the project once and provides feedback on the test results. This is useful for running the tests during development or as part of a continuous integration (CI) pipeline.

- `yarn test:watch` This command runs the tests in watch mode, which means that Jest will keep monitoring the code for changes and automatically re-run the relevant tests. This is useful for test-driven development (TDD) or when you want to quickly iterate on your code and see the test results in real-time.

Make sure to write clear and concise test cases that cover all the critical functionalities and edge cases of your application. Tests should be run frequently and integrated into your development workflow to ensure that your application is always functioning correctly.

## Running the application

This project comes with several scripts that are ready to use for your convenience. The most commonly used scripts are:

- `yarn dev` Starts the development server and hot-reloads changes as you make them. This is the recommended script to use during development.

- `yarn build` Builds the production-ready assets for your application. This script is typically used in a CI/CD pipeline or when deploying your application to a production environment.

- `yarn lint` Runs the linter on your codebase to check for any coding standards and best practices violations. It's a good idea to run this script before committing any changes to ensure the quality of your code.

- `yarn typecheck` Executes the TypeScript compiler to perform static type checking on codebase. This script helps catch type-related errors and ensures that your TypeScript code adheres to defined types.

## Components folder structure

#### Atoms

The Atoms folder contains all the basic building blocks for the application, such as Button, Icon, and Typography components. These components should be simple and reusable, and should only use their own React state if state management is necessary. Atoms should not depend on other components in the application.

#### Molecules

The Molecules folder contains components that are more complex than basic building blocks. Molecules are built out of multiple elements, such as a Form component that combines Input, Button, and Label components. These components should be self-contained and reusable, and should only use their own React state if state management is necessary. Molecules may depend on atoms or other molecules in the application.

#### Organisms

The Organisms folder contains common business components and layouts. Examples of layout components include AppBar and Footer, which will be used in most pages. These components can be composed of atoms and molecules, and should be self-contained and reusable. Organisms may use their own state management solutions, such as Redux or Context API.

#### Pages

The Pages folder contains all page templates, which are then called from Next.js specific pages. Page-specific components should only be placed within the Pages folder. Pages may use their own state management solutions, such as Redux or Context API.

Note: As a rule of thumb, all components that are going to be used in multiple pages should be organized into atoms, molecules, or organisms. Page-specific components should only be placed within the Pages folder.
