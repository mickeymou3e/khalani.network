# lending-contracts
Contracts for Hadouken Lending and CLI for managing data on blockchain

## Setup
1. Insert your private key to `.env` file in root folder. If `.env` doesn't exists create one and paste `DEPLOYER=YOUR_PRIVATE_KEY` replacing fill with your the private key starting with `0x`.
Example: `DEPLOYER=0x313axd2fc54206464c0cf20c68c6b882gfd1a6926f1afd`
2. run `yarn` in command line.
3. run `yarn build` in command line.

## Gnosis safe
Call operations with gnosis safe `https://safe-v1.nervosdao.community/app/`. The contract address of gnosis can be found in `config.json` as `gnosisSafe` field.
1. Insert the flag `GNOSIS_SAFE=true` in `.env` to turn on calls to gnosis safe. If `.env` doesn't exists create one and paste `GNOSIS_SAFE=true`. If the value is false it will make calls from your private address
2. run `yarn cli` in command line.
3. Pick operation that is marked `(Gnosis support)` for example `pool -> administration -> set Pool Owner (Gnosis support)` and the action with be send to gnosis safe.

## CLI
Bear in mind if you want to modify reserves or perform any other action allowed by owner you will need owner key.

Type in console `yarn cli` and select environment, confirm private key and select action you want to perform.

### Pool Owner Pool Admin and Emergency Admin
You can change `Pool Owner` `Pool Admin` and `Emergency Admin` in `pool` -> `administration` by selecting one of these role and selecting `Set Pool Owner`/`Pool Admin` etc.
### Emergency shutdown
Only emergency admin can perform emergency shutdown. You can check or change emergency admin in `pool` -> `administration` as explained above.
Select `pool` -> `administration` -> `Emergency shutdown` -> type `y` and press enter.

### Change reserve parameters
To change values of reserves you need to be Pool Administrator.

Select `pool` -> `reserve` -> `select token` -> select parameter you want to adjust.

Borrow and deposit cap is represented with token amounts - no need to fill decimals value with zeroes. No cap on these actions is represented by value 0.

To Change LTV, liquidation bonus or liquidation threshold - select configure and type these values when prompted or just press enter if you don't want to change value. LTV and liquidation threshold have 2 decimals for example ltv 60% is represented as 6000. Liquidation bonus is represented as percentage above 100% wth 2 decimals - in case of 5% bonus to liquidation the liquidation bonus on blockchain is 10500.

You can update interest rate in 2 ways:
* Update `rateStrategies.ts` file in `markets/nervos` and select `update interest rate strategy` in CLI
* select `change interest rate strategy` and type values in command line

`getConfigure` and `get interest rate strategy` are performing read-only calls that return values from blockchain but doesn't change them.

### Adding new reserve
Before adding new token remember to fill `reserveConfig.ts` and `rateStrategies.ts` for new reserve if needed.

Depending which environment you want to update - add new token inside `local.json`/`prod.json`/`test.json` (these files are located in `src/config`). Run `yarn cli` select `pool` -> `add reserve` -> select token and wait for confirmation.

In case of local and test environment it's possible to deploy completely new tokens - update config file (listed above) and run `yarn cli` select `tokens` -> `deploy` -> select token you want to deploy. After deploying new token you can add reserve same way as above:  select `pool` -> `add reserve` -> choose new token.

Newly added reserve are visible in `deployedContracts` files. 
After adding new reserve it's required to build and publish new contracts package to updated new reserve address.

### Basic operation on tokens
After selecting `tokens` you can perform basic operation like listing, checking balance or transferring to another address. On test and local environment it's also possible to deploy and mint new tokens.
These actions requires to insert values with decimals - for example minting 6 USDC requires to type 6000000. 

### Oracles
On local environment it's possible to manually change price oracles by selecting `oracle` -> `update price` -> selecting token and typing values with 9 decimals (1 dollar is 1000000000).