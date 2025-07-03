# Khalani Application

The Khalani application has been restructured into a monorepo to support independent development, local testing, and deployment of multiple frontends while maintaining a shared codebase. This setup facilitates efficient and scalable development across different parts of the application.

## Monorepo Structure

The Khalani application is organized into a monorepo, containing the following key components:

- **apps/solver-frontend**: The frontend for the Solver app.
- **apps/hyperstream-frontend**: The frontend for the Hyperstream app.
- **libs/shared**: A shared library containing common code, such as wallet and account management, and balance fetching, accessible by both frontends.

## Requirements

- Updated khalani-sdk
- Updated khalani-ui
- Updated configuration files

## Getting Started

### Setting Up the Environment

1. **Obtain Authentication Token**:

   - Get a GitHub token from your account settings that has permissions in the `@tvl-labs` organization (read permissions are sufficient)
   - Save this token in the `.npmrc` file in the root folder

### Installing Dependencies

- Install the necessary dependencies for all apps in the monorepo:
  ```bash
  yarn install
  ```

## Development Workflow

### Running the Application

- Start the development server for the Solver frontend:
  ```bash
  yarn dev:solver
  ```
- Start the development server for the Hyperstream frontend:
  ```bash
  yarn dev:hyperstream
  ```

### Scripts for Linting and Type Checking

The monorepo includes specific scripts for linting and type checking each frontend:

- **Hyperstream Frontend:**

  - Lint:
    ```bash
    yarn lint:hyperstream
    ```
  - Type Check:
    ```bash
    yarn typecheck:hyperstream
    ```

- **Solver Frontend:**
  - Lint:
    ```bash
    yarn lint:solver
    ```
  - Type Check:
    ```bash
    yarn typecheck:solver
    ```

These scripts leverage **Lerna** to run the corresponding tasks within the specified scope, ensuring that linting and type checking are confined to the relevant frontend.

### Webpack Configuration

Each frontend (`solver-frontend` and `hyperstream-frontend`) has its own Webpack configuration, enabling independent development. Aliases are set up to facilitate easy access to the shared code in the `libs/shared` directory.

### Package Management

The monorepo uses **Lerna** to manage dependencies and scripts across different packages. Common tasks, such as installing dependencies or starting development servers, can be managed via scripts in the root `package.json`.

### Continuous Integration/Continuous Deployment (CI/CD)

GitHub Actions are configured to deploy each frontend independently. The CI/CD workflow is triggered based on changes detected in specific paths, ensuring that only the affected app is deployed. Changes to the shared code in `libs/shared` will trigger deployments for both frontends as needed.

### Testing and Validation

Before committing changes, validate the following:

- Local development setup is functioning correctly for both frontends.
- GitHub Actions workflows are correctly identifying and deploying the necessary components based on changes.

## Summary of Recent Changes

- **Monorepo Organization**: Separate directories for `solver-frontend` and `hyperstream-frontend`, with shared code in `libs/shared`.
- **Independent Webpack Configurations**: Custom configurations for each frontend to allow standalone development and testing.
- **Lerna Integration**: Simplified dependency management and script execution.
- **Selective Deployment**: CI/CD configured for efficient and targeted deployments.
