# Task Description

## Introduction

[Barnbridge](https://barnbridge.com/) is a DeFi protocol offering risk-adjusted tranches over lending products such as Compound and AAVE.
BOND is the protocol Governance Token allowing the cummunity to vote on the issuance of new tranches,
protocol related parameters or any other crucial decision.

To Incentivize liquidity for the BOND token the protocol includes a [rewards programm](https://app.barnbridge.com/yield-farming) for the Uniswap BOND/USDC pair.
Users can provide liquidity to the BOND/USDC pair and stake the Liquidity Provider (LP) tokens on Barnbridge.
20'000 BOND tokens are distributed each week and split proportionally between the LPs based on the amount of liquidity provided.

## The Code

A Basic Implementation of a React Component is given in the `src/components/staking.tsx` file, this includes two examples of calls to the smart contracts that return some data.

An Example User Address is used in the component to demonstrate how a parameter is passed to the call.

The Smart Contract in question are:

- the Uniswap BOND/USDC Pool into which users deposit liquidity and receive LP tokens from
- the Barnbridge Staking contract in which user stake the Uniswap LP tokens and get distributed weekly rewards

The connection to the contracts is made in the `src/web3/connector.tsx` component through the [web3-react](https://www.npmjs.com/package/web3-react) library using the public Infura Ethereum Nodes. This part does not need to be changed necessarily.

## The Task

The Task is to develop a basic application that allows a user to input an Ethereum address and then displays:

- The USD Value of the Yearly Rewards Paid to the user, computed as:  
  `TotalRewardsUSD * (LPTokensStaked/TotalLPTokens)`
- The Annual Percentage Yield (APY), computed as:  
  `(YearlyRewardsUSD / LiquidityProvidedUSD) * 100`
- Other interesting information like: compounded APY, or balance after 2,5,10 Years are a bonus

It will be required to get additional data from the two contracts like, for example, the USD Price of the BOND token, the functions available from the contracts can be found and tested here:

BarnBridge Staking Contract:

- https://etherscan.io/address/0xb0fa2beee3cf36a7ac7e99b885b48538ab364853#readContract

Uniswap LP Token Contract:

- https://etherscan.io/address/0x6591c4bcd6d7a1eb4e537da8b78676c1576ba244#readContract

Of course, the Application should be nice to look at :)

The task should be completed by pushing the code to a new branch and opening a Pull Request on this repo

For questions regarding the task, feel free to reach out at ab@dialectic.ch

# React Stuff

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
