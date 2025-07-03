# Overview

Khalani is the first decentralized cross-chain native stable coin protocol. Khalani's first asset, PAN, is an inter-chain native stable coin with its price anchored to the US Dollar.

# Assets

Talk about the current stable coins

- fiat backed centralized, because it's backed by their fiat reserve, it's possible for them to be on multiple blockchains
    - rely on bridges, requiring liquidity to be transferred across bridges.
- on-chain collateral backed stables.
    - single chain
    - minting and price parity mechanisms on a single chain and rely on bridges to transfer to other chains
        - pick a single bridge to bring it to all other blockchains. this binds the security of the stablecoin to the security of the bridge
        - allow any bridge to bridge it, resulting fragmentation of liquidity.
    - can't natively own minting on all chains, except that they either explicitly trust the cross chain messaging, or the cross chain messaging is inherently trustless.
        - custody risk
        - economic security - how could a stablecoin market of $1B trust a bridge with the economic security of $30m?


A true cross-chain native stable coin

- should be able to be minted and used natively on any blockchain
- should be able to be transferred between blockchains without having to require provided liquidity with minimum cost, without explicit trust to any 3rd party bridges or messaging protocols
- should serve as a source of unified liquidity to apps on all the chains it connects to


Cross Chain bridges

Externally verifies bridges
    - bridge's economic security vs the value it secures

Natively verified bridges



more development - zero knowledge verified 



# The System Design of Khalani

Khalani protocol builds

- the savoreign Khalani Chain (KC). The Khalani Chain serves both as a hub for cross chain PAN transactions, as well as the environment that requires atomicity and synchronous execution in the Khalani ecosytstem.
- Nexus is a cross chain messaging protocol that connects Khalani Chain to all other blockchains. Nexus fortifies all cross chain transactions between Khalani Chain and other blockchains.


Interaction Diagrams


# Minting and Redemptions

# Price Stability




Another type of stable coins are backed by centralized entities. For example, USDC is backed by a consortium called Centre, with participation from Circle and Coinbase. Centralized fiat backed stable coins do exist on multiple blockchains, however, they typically require centralized infrastructure to move the funds.

Frictionless


Multi-Chain 

# PAN, Inter-chain native Stable Coin

Pan is an inter-chain native stable coin price pegged to the US Dollar. Pan can be created and used on multiple blockchains, with the built-in ability to transfer across blockchains completely friction free.

The Khalani ecosystem is built on top of PanAssets, a set of new financial primitives with the built-in ability to be created, used and transferred across blockchains completely friction free.

The first PanAsset we're releasing is PAN, a stablecoin token that pairs with the US Dollar.

# Design Considerations for Cross Chain Native Assets

- application 

# The Need for Blockchain Interoperability

# Minting, Redemption and Price Stability

# Protocol Controlled Value

# Nexus, the Cross Chain Infrastructure

# XXX, A Cross-Chain Bridge Aggregator and Liquidity Protocol

## The Problem

## Cross chain bridges and message passing protocols

## Risk Isolation
...
## Liquidity Fragmentation

# Existing Solutions

# Khalani Dao
