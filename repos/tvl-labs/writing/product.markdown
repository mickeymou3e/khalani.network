Product Tickets / Issue Tracking

TODO:
    - Add images for frontend reference
    - Add PSM and custodian to diagram.
    - provide interfaces
    - Add labels to GH project
    - Fix Dework permissions issues.
    - Pull Request - async

Note:

# The Big Picture

- Users are able to deposit whitelisted stable tokens to mint PAN
  - USDC on Ethereum, Avalanche, Tron
  - BUSD on Ethereum and BSC
  - USDT on Ethereum, Tron, Avalanche

- Users are able to redeem PAN for whitelisted stable tokens on select blockchains
    (same list as the above)

- Users are able to provide cross chain liquidity with whitelisted stable coins
  - USDC, USDT, DAI and BUSD on the chains in "Chains to Support" section
  - PAN

- Users are able to withdraw cross chain liquidity with whitelisted stable coins

- Users are able to transfer stable coins from one chain to another
  - the same whitelist as in the "provide liquidity" section
  - PAN can go from one chain to another directly via "burn and mint"

## Epics / Milestones

1. Have a working chain (Khala) based on Axon, and users are able to LP and Trade with a single pool

### Infrastructure

- Set Up Production Ready POA chain running Axon
  - Core
    - Deployment
      - Kubernetes deployments
      - Permission Contract Deployments
      - 0 gas fees
      - CI
  - Auxiliary
    - Observability
      - Deploy ELK (elastic search, logstash and kibana)
    - Monitoring and Alerting.
      - Deploy Prometheus
    - Faucets.
    - Block Explorer

- Balancer
  - Composable Stable Deployment
  - Front End deployed connected to Khala
    - Connect front end to Khala
    - Subgraph
      - Point url to k8 cluster
      - Deploy in k8 ( Follow task)

- Bridges
- Bots

- Gnosis
  - Set up on EC2
  - Set up on k8
  
### Feature sets

- users are able to provide liquidity to the pool on the UI with Metamask
  - Frontend
  - Backend / Solidity
- users are able to withdraw liquidity to the pool on the UI with Metamask
- users are able to trade (A <-> B) with the pool on the UI with Metamask
- users should be able to see their transactions on the block explorer

1. Basic cross-chain features and infrastructure

Infrastructure:

- integrate with one of selected AMB frameworks between Ethereum testnet and Khala (Omnibridge? Celer? Hyperlane?)

Feature sets:

- users are able to lock USDC on ETH in the custody contract and mint USDCeth on Khala through the AMB
  - front end
    - mock smart contract interfaces.
      - deposit
## Request

```json
{
    user : address
    token : address
    destinationChain: bytes
}
```

## Response

```json
{
    success : bool
}
```
    - modify CSS
    - Integrate mocked apis into front
  - back end
    - Source Contracts
      - gateway: User facing contract that interact with custody. Posses multiple facets for routing messages between chains.
        - defi
        - `function transferKhalini (address user, address token , bytes destinationChain) returns bool {}`
        - `function deposit (address user , address token, bytes destinationChain) returns bool {}` ;
          - should call `Custody.sol` 
      - custody: Store key value mappings of the user deposits.
        - onlyGateway() : Only the gateway should be able to communicate with this contract.
        - deposit(uint256 user, address token , bytes destinationChain )
    - Khala Contracts
      - Nexus:
        - Processes messages from source chains
        - Dispatches messages to destination chains.
        - Methods
          - mintAsset
          - addLiquidity
      - Custodian: creates shares for deposits and maps them to BPT tokens.

- users are able to burn USDCeth and unlock USDC on the custody contract on ETH through the AMB
  - as a "protocol native" asset, USDCeth will be burned on Khala and minted on Ethereum
  - protocol native assets mean that we have minting rights on them on all the chains
  - front end
    - mock smart contract interfaces.
      - unlock (TODO: Sam to provide interface)
    - modify CSS
    - Integrate mocked apis into front
  - back end
    - Source Contracts
      - gateway: User facing contract that interact with custody. Posses multiple facets for routing messages between chains.
        - define interfaces
        - build out omni amb facet.  
      - custody: Store key value mappings of the user deposits.
        - onlyGateway() : Only the gateway should be able to communicate with this contract.
        - withdraw(uint256 user, address token , bytes destinationChain )
    - Khala Contracts
      - Nexus:
        - Processes messages from source chains
        - Dispatches messages to destination chains.
        - Methods
          - burnAsset
          - removeLiquidity

- users are able to deposit USDC and mint PAN on Ethereum through the PSM (similar to Maker PSM)
  - deposits one USDC and gets one PAN
  - frontend
    - mock interface
      - mint ( Sam to provide interface)
      - estimate transaction fees and display them
      - error handling modals.
        - for v1 , create modals to propagate errors.
        - later once , use interceptors to make them more readable.
      - fees = 0.

## Request

```json
{
    token : address
    user: address
    amount: BigNumber
}
```

## Response

```json
{
    success : bool
}
```

- backend
  - Source Contract
    - PSM
      - mint(address token, address user , uint256 amount) external returns bool {}
      - TODO: chainlink integration for pricing data.

- users are able to deposit PAN and redeem USDC on Ethereum
  - redemption cost is 0.5%
  - deposits one PAN and gets 0.995 (1 - 0.5%) USDC back
  - frontend
    - mock interface
      - redeem( Sam to provide interface)

## Request

```json
{
    token : address
    user: address
    amount: BigNumber
}
```

## Response

```json
{
    success : bool
}
```

- backend
  - Source Contract
    - PSM
      - redeem(address token, address user , uint256 amount) external returns bool {}

- users are able to transfer PAN from ETH to Khala
  - as a "protocol native" asset, PAN will be burned on Ethereum and minted on Khala
  - frontend
    - Interface

## Request

```json
{
    token : address
    user: address
    amount: BigNumber
}
```

## Response

Output

```json
{
    success : bool
}
```

- backend
  - Source Contracts
    - PSM
      - burn(address token , address user) external returns bool {}
  - Khala Contracts
    - Nexus
      - mint(address token, address user) external returns bool {}

- users are able to transfer PAN from Khala to ETH
  - as a "protocol native" asset, PAN will be burned on Khala and minted on Ethereum

## Request


```json
{
    token : address
    user: address
    amount: BigNumber
}
```

## Response

```json
{
    success : bool
}
```

- backend
  - Source Contract
    - PSM
      - redeem(address token, address user , uint256 amount) external returns bool {}

- users are able to transfer PAN from ETH to Khala
  - as a "protocol native" asset, PAN will be burned on Ethereum and minted on Khala
  - frontend
    - Interface

## Request

```json
{
    token : address
    user: address
    amount: BigNumber
}
```

## Response

```json
{
    success : bool
}
```

- backend
  - Source Contracts
    - PSM
      - burn(address token , address user) external returns bool {}
  - Khala Contracts
    - Nexus
      - mint(address token, address user) external returns bool {}

- users are able to provide liquidity from Ethereum to a USDC/PAN pair on Khala
  - USDC is locked in custody contracts then USDCeth is minted on Khala
  - PAN is burned and minted on Khala
  - USDC and PAN are provided to a 50/50 Composable Stable Balancer Pool
  - frontend

## Request

```json
{
    tokenA : address
    tokenB : address
    user: address
    amountA: BigNumber (// Note , amountA & amountB must be equal)
    amountB: BigNumber
}
```

## Response

```json
{
    success : bool
}
```

- backend
  - Source Contracts
    - Gateway
      - addLiquidity(address tokenA address tokenB uint256 amountA uint256 amountB bytes) external returns {}
  - Khala Contracts
    - Nexus
      - addLiquidity(address tokenA address tokenB uint256 amountA uint256 amountB bytes) external returns {}

- users are able to withdraw all liquidity from Ethereum from a USDC/PAN air on Khala
  - USDCeth and PAN will be withdrawn from the pool
  - USDCeth and PAN will both be burned on Khala
  - USDC will be unlocked from custody contract on Ethereum and sent to user account
  - PAN will be minted on Ethereum and sent to user account
  - frontend

## Request

```json
{
    tokenA : address
    tokenB : address
    user: address
    amountA: BigNumber (// Note , amountA & amountB must be equal)
    amountB: BigNumber
}
```

## Response

```json
{
    success : bool
}
```
  - backend
    - Source Contracts
      - Gateway
        - `function removeAllLiquidity(address tokenA, address tokenB , address user ) returns bool {}`;
    - Khala Contracts
      - Nexus
        - `function removeAllLiquidity()`  #TODO: Sam add function signature
          - `function exitPool()` #TODO: Sam add function signature
          - `function redeemShares()` (Nexus Vault) #TODO: Sam add function Signature

- users are able to view the transaction on blockchain explorer (Infrastructure)
  - Deploy Blockscout.

1. More Complete Cross-chain Features

Infrastructure:

- deploy two more Balancer pools on Khala
  - USDTeth / PAN
  - BUSDeth / PAN

Feature sets:

- Create a whitelist of tokens (stable coins) that we support on Ethereum
  - USDC, BUSD, USDT

- users are able to lock whitelisted tokens on ETH and mint XXXXeth on Khala through the AMB

- users are able to burn XXXXeth and unlock XXXX on ETH through the AMB

- users are able to deposit USDC, BUSD and USDT and mint PAN on Ethereum

- users are able to redeem PAN for USDC, BUSD or USDT
  - users should be able to specify the white listed assets they want to redeem for their PAN

- users are able to provide liquidity from Ethereum to a XXXXeth/PAN pair on Khala

- users are able to withdraw liquidity from Ethereum to a XXXXeth/PAN pair on Khala

- users are able to trade bewteen whitelisted assets on Ethereum

1. Add BSC Chain

Infrastructure:

- Deploy the following pools on Khala
  - USDCbsc / PAN
  - USDTbsc / PAN
  - BUSDbsc / PAN

Features:

- users are able to lock USDC, BUSD and USDT on BSC and mint USDCbsc BUSDbsc and USDTbsc on Khala through the AMB

- users are able to burn those above tokens on BSC through the AMB

- users are able to deposit BUSD and mint PAN on BSC
  - deposits one BUSD and gets one PAN

- users are able to redeem PAN for their BUSD

- users are able to transfer PAN from BSC to Khala

- users are able to transfer PAN from Khala to BSC

- users are able to provide liquidity from BSC to a USDCbsc/PAN, USDTbsc, BUSDbsc pair on Khala

- users are able to withdraw liquidity

- users are able to trade with BUSD and PAN on BSC.
  
- users are able to send USDC for PAN on Ethereum on BSC through Khala
  - USDC will be locked in custody contract on Ethereum
  - USDCeth will be minted on Khala
  - USDCeth will swap for PAN on Khala
  - PAN will be burned on Khala
  - PAN will be minted on Ethereum

- users are able to trade PAN for USDC on Ethereum through Khala

1. Add Avalanche and Tron

Repeat from 3 for two new chains

5. Interaction between external chains, AKA 3 chain interactions (non Khala chains are external chains)

Infrastructure ???

Feature Set:

- Users are able to transfer PAN from one external chain to another external chain
  - PAN will be burned on Chain 1 and minted on Chain 2
  - ideally we don't go through Khala for this???

- Users are able to transfer stable coins from  external chain 1 to  external chain 2
  - if the asset is PAN, burn on chain 1 and mint on chain 2 (look above, we already did this)
  - if the asset is other whitelisted assets
    - the asset is going to lock on chain 1 and minted on Khala
    - the minted asset is going be be used to swap on Balacer
    - the acquired asset is going to be transferred to chain 2 (burn and unlock)

--------

V2 and future

6. Use local Protocol Owned Values (POL) and Protocol Controlled Values (PCV) for local PAN liquidity

Infrastructure (Ethereum as an example)
    - Deploy USDC / PAN, USDT / PAN & BUSD / PAN pools on Curve or Balancer

Features:
    - All assets locked in PSM is considered POL. Those are the value that backs PAN.
        - If POL < total circulated PAN, people can bankrun the protocol and PAN will depeg.
        - If users want to convert them PAN to any POL tokens, they have to pay 0.5% fee.
    - All assets locked in custody contracts are considered PCV. Those are the value that backs USDCeth, USDCbsc, USDTbsc etc. We get those assets when people want to provide liquidity.
        - custody contracts behaves more bridges, the user is essentially transfer
        - If users want to convert mirror tokens (USDCeth, USDCbsc, USDTbsc etc) back to PCV values, it's free.
    - The protocol is able deposit its deposit POL & PCL into a vault that keeps 20% of the tokens liquidity for cross chain and redumption liquidity
    - The protocol deposits all the 80% USDC and mint the same amount of PAN (owned by the protocol itself) to the Curve USDC / PAN pool
        - the LP token it gets belongs to the protocol as well (Protocol owned local liquidity)
    - The protocol deposits all the 80% USDT and mint the same amount of PAN (owned by the protocol itself) to the Curve USDC / PAN pool
    - have a bot that monitors the 80/20 liquidity ratio so that we always keep enough value for withdraw and redumption but not keeping too much sitting idle

7. Finish the PSM (this applies to PSM on all non-Khala chains)

- only allow minting if the white listed tokens oracle price is above $1
- only allow redemption is the white listed assets oracle price is below $1.002

- in other situations, we recommend people to trade instead of minting/redeeming
