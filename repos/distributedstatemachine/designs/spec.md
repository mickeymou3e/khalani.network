# Parity MVP (Gaia)

## Overview

Bridges are vital components for scaling in a multi-chain blockchain world. Despite the ever growing importance of bridges , existing solutions are expensive, fragment liquidity , or do not guarantee finality, or expose users to undue risk.

Parity aims to alleviate this woes by creating a agnostic liquidity protocol to enable the seamless exchange of value between blockchains.

## Architecturally Significant Items

Parity is composed of two subsystems:

- Parity Core
  - This module is comprises of smart contracts responsible for managing  is the liquidity layer. It comprises of :
    - Liquidity Pools: These are pools of OmniAssets liquidity on different chains. LP providers provide liquidity in equal amounts of USDC/ USDT / BUSD and OmniUSD. The base for these would be the balancer [Stable pools](https://github.com/balancer-labs/balancer-v2-monorepo/tree/master/pkg/pool-stable)
    - Peg Stability Module: Similar is Maker's PSM , this module is responsible for maintaining the price of the OmniUSD close to $1. Based on whether or not there is excess demand / supply , it would incentivize the minting / burning of OmniAssets.
- Nexus
  - In order to enable unified liquidity pools and prevent race conditions , Parity will employ Nexus, a high throughput sidechain , to facilitate consensus driven general message passing and value transfer. Nexus Validators will:
    - Order and Sign blocks
    - Listen to confirmation events and attest their validity.
  - Nexus will employ Application Controlled Relays ; each application that integrates into integrates into Parity would be responsible for relaying cross chain messages.

### Actors

- End Users: Blockchain users or applications that wish to transfer value from one chain to another.
- Liquidity Providers: Exchange USDC/ USDT/ DAI for OmniUSD ; the medium for cross chain value transfer.
- Validators: Responsible for listening to events from all connected chains , signing and broadcasting blocks.

## Requirements

- Users SHOULD be able to use any messaging passing protocol
- Users SHOULD be able to allow users to mint OmniUSD in exchange for USDC/ USDT/ DAI.
- Users should be able to redeem USDC/ USDT/ DAI in exchange for OmniUSD

## User Stories

### PSM

- As a USER , I want to mint OmniUSD for USDC, USDT, DAI
- As a USER, I to to redeem OmniUSD for USDC, USDT, DAI

### Liquidity Provision

- As a Liquidity Provider, I want to be able to add liquidity to the OmniUSD/(USDC/USDT/DAI) Pool, so that I can earn trading / swap fees.
- As a Liquidity Provider, I want to be able to remove liquidity from the OmniUSD/(USDC/USDT/DAI) Pool, so that I can reclaim my assets.

### Validator

- As a VALIDATOR, I want to be able to run a node, so that I can validate transactions.
- As a VALIDATOR, I want to be able to subscribe to bridge events on each chain.
- As a VALIDATOR, I want to be add signatures to attested events to a new block header.

### Cross Chain

- As a USER , I want to be able to send funds from a source chain to a destination chain using OmniUSD. 

## Milestones

### 1

- Parity Core
  - OmniUSD Pools.
  - Deployment on 2-3 chains.

- Nexus
  - POA Axon chain
    - Signed messages are sent to the collector
    - Same committee run the bridges and multi sig.

### 2

- Parity Core
  - OmniETH, OmniBTC Pools.
  - Deployment on additional chains.

- Nexus
  - POS Axon chain
    - Validation of cross chain messages consensus driven

## Open Questions

- How much of Maker's [DSS-PSM](https://github.com/makerdao/dss-psm) can we reuse?
- How do we bootstrap liquidity - GTM
- Finality: 
- Does adopting the side model pattern still allow us to be an alternative oracle source?
- Go To Market
  - Blockchains are inherently tribal. It is therefore important to respect the current community fabric in each blockchain space.
  - For every chain we connect to, we should create a subDAO.
  - Each subDAO would be able to elect their own guardians, interest generation strategies, and dictate how their Protocol Controlled Value (PCV) is managed.
  - In return for this, the DAO receives a percentage of the fees, while the rest will be distributed to the guardians.
  - This approach has the advantage of converting individuals who are deeply embedded into the community as marketing champions, while isolating the risks that can arise for each subDAO mismanaging their PCV.

## Resources

- nxtp
  - [Basics](https://docs.connext.network/basics/intro)
  - [Github](https://github.com/connext/nxtp)
- [Pool Stable Phantom](<https://github.com/balancer-labs/balancer-v2-monorepo/tree/master/pkg/pool-stable-phantom>).
- [Nervos Force Bridge](<https://github.com/nervosnetwork/force-bridge-eth>).
- [Scaling Seignorage](<https://medium.com/terra-money/scaling-seigniorage-a72356a118ae>).
- Amarok
  - [Blog](<https://blog.connext.network/announcing-the-amarok-network-upgrade-5046317860a4>)
  - [Github Discussion](<https://github.com/connext/nxtp/discussions/799>)
- IST
  - [Whitepaper](<https://agoric.com/wp-content/uploads/2022/05/Draft-Inter-Protocol-Whitepaper-v0.9-1.pdf>)
- Axelar
  - [Grants](<https://axelar.network/blog/axelar-cross-chain-grant-program-announces-18-winners>)
    - They already have a team building a cross chain stable coin on it, and bridge aggregators.
- [DeBridges](<https://debridges.com/>)
- [LiFi Knowledge Hub](<https://li.fi/knowledge-hub/>)
- [Swim Protocol](<https://swim.io/whitepaper.pdf>)
- [Holograph](<https://docs.holograph.xyz/>)
- [Palomachain](https://github.com/palomachain)
- MakerDAO
  - [PSM]
    - [Desription](https://makerdao.world/en/learn/governance/module-psm/)
    - [Git Repository](https://github.com/makerdao/dss-psm)
  - [System Architecture](https://github.com/makerdao/dss/wiki)
- Near
  - [Rainbow Bridge](https://learnnear.club/how-the-near-rainbow-bridge-works/)
