# Description

These document provides an overview of processes / artifacts that are required to enable the delivery of the product roadmap.

Note that all time estimates assume **2 Smart Contract Devs, 1 Front end Dev, 1 integrations engineer and a backend engineer**.

## Milestone I - Testnet

This introduces basic functionality that allow:

* Users are able to mint PAN with whitelisted stablecoin on whitelisted chains
* Users are able to provide stablecoin + Pan liquidity
* Users are able to withdraw stablecoin + Pan liquidity
* Users are able to trade/transfer stablecoin across chains

## Milestone II - Mainnet Alpha

* Product
  * Algorithmic Market Operations (1 months)
    * Algorithmic Markets Operations (AMOs) denote monetary policies enacted by the protocol in order in order for the protocol to maintain it's Peg. In order words , AMOs are able to interact with the liquidity pools to either mint / burn Kai . The primary objective of the AMO is price stability of Kai , while generating profits for the protocol secondary.
    * States: We define the following states for the PSM
      * Overcollaterised :  KAI > $1
      * Equilibrium :  KAI = $1
      * Undercollaterised: Kai < $1.
    * Each AMO will define the following interfaces
      * Decollaterise: When Kai is overcollateralised , the AMO removes assets from the protocol and invests them to generate income. This would lower the price of Kai
      * Equilibrium: When at Equilibrium , the AMO does nothing.
      * Recollaterise: When Kai is undercollaterised , the AMO free capital , and adds them back to the protocol.
     
     ![plot](.assets/amo_flow_chart.png)
    * Architecturally Significant Items
      * Curve AMO: This AMO interacts with Curve pools. We should be able to take a lot of inspiration from the [Frax Curve AMO](https://etherscan.io/address/0xbd061885260F176e05699fED9C5a4604fc7F2BDC)
  * Gas (3 weeks )
    * Our relayers currently don't have a means of estimating gas , particularly as for cross chain bridges , which would require a 2 chain hop i.e. A > B > C.
    * For A naive solution would be to query the gas costs from A  > B , and then from B > C, but this would be impossible to do on-chains , due to the asynchronous nature of inter chain messaging. We would therefore need to query these on the front end for both hops.
    * There is also an additional overhead of determining which currency the relayers are paid in / users are charged. We should look into integrating meta transactions / gasless transactions (e.g. Biconomy / Open GSN)
    * We also need to look into edge cases with withdrawals/ deposits  , what happens to the fees.
    * Take fees in the asset they move around.
  * KhaScan (1 month):
    * There is a need for user to be able to trace their transactions through the life cycle. KhaScan consists of a data indexing service that ingests data from all the relevant chains , and displays Khalani related transactions in a UI.
    * We need to strongly consider that we would most likely be integrating more than 1 bridge ,and hence to to accommodate for capturing each bridge's semantics.
  * More Chains
    * We intend to roll out Nexus to additional chains EVM chains . This should be a minimum overhead since we already it should mean redeploying Nexus on the additional chains and running relayers to deliver messages between Khala and the chains.
* KhalaOps
  * Axon Faucet
  * Axon Validators
  * Validator Security
  * Hyperlane
    * Key Funder
    * Relayer KMS - Solved refer to [this](https://discord.com/channels/935678348330434570/984123861144600587/1075093690625822841)
  * Monitoring & Log Aggregation (1 month)
    * PSM  / Kai
      * The service will monitor invariants for Khala across all bridges
      * Trigger a pause on the PSM smart contract should be any of the invariants be breached.

## Milestone III (3 months)

* Product
  * Pan Crypto
    * PanETH
      * Core Contracts
      * AMO Integrations
    * KaiBTC
      * Core Contracts
      * AMO Integrations
    * KaiCKB
      * Core Contracts
      * AMO Integrations 
  * AMO expansion  (Tentative)
  * Amplified Liquidity?
    * Leverage (see Yama (dont use AMOs but PSMs), Gearbox )
    * With 1K USDC , you can provide 10K USDC Kai liquidity.

## Milestone IV

* Lending*.
  * We may not need this if we choose CDPs , as this implies borrowing
  * We would priotise leverage over lending. 





