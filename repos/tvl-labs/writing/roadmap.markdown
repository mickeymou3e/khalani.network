NOTE:

Infrastructure build up such as IBC compatibility, security mechanisms etc are very important but are not in this roadmap

v1:
================

# Overall Goal

We'd like to launch the protocol into the public, start telling our story and building a community.

## For Users

- Users should be able to read our docs to get a baseline understanding of the protocol and why it's interesting
- Users should be able to use our UI to perform basic cross chain bridge functions (trade, add liquidity, remove liquidity)
- Users should be able to mint, redeem and swap into our stablecoin (PAN)

## For Developers

- Developers should be able to read our docs to get a baseline understanding of the protocol and why it's interesting
- There should be enough technical content to let developers get a sense of our solution and the approach.
- There should be enough content and tutorials to let developers build alternative UIs based on Pangea and earn commissions.

# Chains to Support

- Core: Ethereum, BSC, Avalanche, Godwoken, Optimism, Polygon, Tron, Gnosis (?)
- Extension: ??? chains through partner bridges (celer, multichain etc)

# Epics

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

v2:
================

# Overall Goal

Increase TVL and PAN Liquidity (the two are equivalent)

# Go to Market

- Become the go to liquidity bridge between Nervos and other ecosystems
- Tight integration with Hadouken so that PAN becomes part of the 3pool
- Lay the groundwork (Strategies / Vaults) for integrations with the Defi ecosystems in the chains we connect to. One idea here is to generate principle protected yields, to protect the principle while leveraging on earnings. 
- Partnerships with local Defi ecosystems
- Podcasts, interviews, meetups, conferences

## For Users

- We should provide attractive yields for users that they're willing to park their stables with us

## For Developers

- We need to set up the infrastructure for developers to contribute to the protocol
- Through our community presence, we need to establish the technical credibility and the problem / solution fit to attract the best contributors.

# Epics

All production features here are for two goals: 

1) make yields more attrative
2) increase PAN monetary base

- Users can mint PAN through major Cryptos (WBTC, ETH, AVAX, BNB, CKB etc)
    - the protocol sells the assets on partnership DEXes to USDC/USDT/BUSD etc and mint PAN
- Protocol / DAO can mint PAN without collateral and inject into liquidity pools as POV to capture seigniorage premium
- Protocol can deposit POV into whitelisted Strategies to integrate with local Defi ecosystem
- Protocol can distribute POV to depositors to boost yield


V3
================

# Overall Goal

Expand assets, continue to build up TVL and build liquidity for other panAssets through leveraged lending

# Go to Market

- Expand to more chains, prioritizing up and coming chains / Layer 2s
- Build subDAOs
- Have strong presence into chain specific communities, participate in their online and offline events, DAOs, etc
- Build partnerships with chain specific wallets
- Build partnerships with chain specific dApps to help them go multi-chain (Hadouken will trailblaze this)
- Build a network of core influencers
- Use airdrops and token launch events to attract capital

# For Users

- participate in the subDAOs to contribute
- deposit and transfer BTC, ETH, CKB and other major crypto assets to provide cross chain liquidity
- borrow PAN against Stable/PAN LP tokens
- borrow panETH against ETH/panETH LP tokens
- borrow panBTC against BTC/panBTC LP tokens
- borrow panCKB against CKB/panCKB LP tokens

# For Developers

- Build apps on top of the unique properties of panAssets

# Epics

- Launch assets of major cryptos such as panBTC, panETH, panAvax, panCKB, etc
- Launch liquidity pools for the major crypto assets.
- subDAOs with commission in fees
- Borrow PAN, panBTC, panETH, panCKB against their stable pairs

V4
===============

# Overall Goal

Token launch and cross asset liquidity pools to accelerate growth and community
