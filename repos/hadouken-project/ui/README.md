# Hadouken UI Package

The Hadouken UI package is a comprehensive collection of user interface components and utilities designed to enhance the visual appeal and functionality of Hadouken applications. It provides a set of reusable UI elements and styling options that can be easily integrated.

## Features

- **Responsive Design**: The UI package offers responsive design capabilities, ensuring that application looks great on various devices and screen sizes.

- **Component Library**: It includes a wide range of ready-to-use components, such as buttons, forms, modals, navigation bars, and more.

- **Icons**: The UI package includes collection of tokens icons.

## Installation

To install the UI package, follow these steps:

1. Add the package to your project using npm or yarn:

   ```bash
   npm install @hadouken-project/ui
   ```

   or

   ```bash
   yarn add @hadouken-project/ui
   ```

## Storybook

Storybook is a powerful development tool that allows you to visualize and interact with all the components included in the UI package. To run Storybook and explore the components, follow these steps:

1. Open your terminal or command prompt.

2. Navigate to the root directory of the UI package.

3. Run the following command:

   ```bash
   yarn storybook
   ```

   This command starts the Storybook server.

4. Once the server is running, open your web browser and go to `http://localhost:6008`.

## Release

Releasing a new version of the Hadouken UI package involves a few simple steps. Here's a streamlined guide on how to make a release:

1. **Update Version**: Update the version number in the `package.json` file to reflect the new release. Follow semantic versioning guidelines to determine whether it's a major, minor, or patch version update.

2. **Build Package**: Run the following command to build the UI package:

   ```bash
   yarn build
   ```

   This will generate a production-ready build of the package with optimized code and assets.

3. **Create a Release on GitHub**: Go to the GitHub repository page for the UI package and navigate to the "Releases" section. Click on "Draft a new release" and provide the version number and a brief description of the release. Upload the built package files, such as the minified JavaScript and CSS files, as release assets.

4. **Publish the Release**: Review the release information and assets, ensuring they are accurate and complete. Once everything is verified, click on "Publish release" to make the release public. This will make the new version available for download and usage by others.

## License

The UI package is released under the [MIT License](https://opensource.org/licenses/MIT).
