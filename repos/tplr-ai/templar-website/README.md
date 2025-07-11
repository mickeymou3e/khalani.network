This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, install all dependencies:

```bash
pnpm i
```

Then run the development server:

```bash
pnpm dev
```

This starts the next.js development server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

This project is deployed on [Vercel](https://vercel.com/tplr/bittensor-templar)

### `main` branch

This is the production branch. Any push to the main branch will trigger a new production deployment to [https://bittensor-templar.vercel.app](https://bittensor-templar.vercel.app/) and any mapped domain name.

Usually only updated by merging a PR from `develop` into `main`.

### `develop` branch

This is the default working branch that is used for development. Any push to the `develop` branch will trigger a new deployment to [https://bittensor-templar-git-develop-tplr.vercel.app](https://bittensor-templar-git-develop-tplr.vercel.app/)

Please branch out to `feat/xyz` branches for each feature you want to add. All Pull requests get their own deployment previews on Vercel which can be used to test changes before merging into the develop branch.
