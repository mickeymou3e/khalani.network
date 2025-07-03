# What's Khalani?

Khalani is the first Universal Liquidity Protocol designed from the ground up for the interoperable blockchains. Built to scale permissionlessly with high capital efficiency and security, Khalani is ready to serve as the liquidity foundation for the next 10,000 modular blockchains.

Khalani is designed with the following goals:

### Permissionless Integration

Anyone can deploy Khalani's contracts and operate the off-chain infrastructure to integrate any assets on any blockchain with Khalani.

### Universal Liquidity

Khalani allows liquidity to be provided to one blockchain, while being aggregated and accessible from everywhere, optimizing capital efficiency while ensuring the safety of funds for liquidity providers.

### Secure by Construction

Khalani is designed for high security as an open and permissionless liquidity protocol. Counterparty risks are clearly tokenized and isolated to eliminate systematic risk, while the protocol's own liabilities are managed with unified global accounting.

# FAQ

### What's a Universal Liquidity Protocol?

First-generation liquidity protocols like Uniswap, Curve, and Aave operate on a single blockchain, serving specific use cases. Inter-chain liquidity protocols, also termed "liquidity bridges", are primarily designed for the single use case of transferring value between different blockchains.

Khalani, the first Universal Liquidity Protocol, functions on multiple blockchains from the start, allowing provided liquidity to be used from anywhere and serving an array of use cases. Users can provide liquidity, trade, lend, and borrow directly on blockchains connected by Khalani, much like using a local liquidity protocol. Additionally, they can utilize Khalani's liquidity across various blockchains for inter-chain use cases.

### Is Khalani a token bridge?

While Khalani can effectively function as an inter-chain token bridge, it also allows complete cross-chain liquidity composability, introducing novel use cases. For instance, an application may accept user's deposit on one blockchain, send the funds to make market and farm on the second blockchain, and hedge against volatility in a derivative protocol on the third blockchain, all while utilizing Khalani's liquidity across the involved blockchains.

### What does Permissionless Integration mean?

Permissionless Integration in the context of liquidity protocols can be understood through the examples of Uniswap and Curve. With these protocols, anyone can create a liquidity pair, provide liquidity or perform trades.

Khalani takes this concept further, allowing permissionless integration for assets from anywhere to be onboarded its universal liquidity. This is significant in the evolving landscape of modular blockchains, where applications are bulit on their own infrastructure best customized for their needs.

### Why didn't permissionless inter-chain liquidity exist before Khalani?

Inter-chain liquidity protocols use asynchronous cross-chain messaging to function across blockchains. This introduces challenges absent in a synchronous, single-blockchain environment.

For example, within a single blockchain, the consensus mechanism enforces the integrity of token contracts. However, in inter-chain scenarios, such guarantees cannot be made. The potential for token double-spending or fork attacks complicates cross-chain accounting, and could lead to loss of liquidity provider's funds or even insolvency of the protocol.

Given these challenges, most inter-chain bridges or liquidity protocols require permissioned deployments to integrate new blockchains. Typically, a centralized party, usually the core team, vets the new blockchain and operates the messaging infrastructure before integrating it into the inter-chain ecosystem. While this process helps mitigate trust-related risks, it also imposes a significant barrier to onboard new blockchains.

### How is it possible for you to allow permissionless inter-chain liquidity? How is Khalani built differently?

Completely avoiding risks in a truly permissionless inter-chain environment is impossible. Our approach is to eliminate systematic risks and compartmentalize exposures to individual assets and blockchains. This approach mirrors liquidity protocols like Uniswap, where individual asset risks are isolated within their liquidity pools, affecting only those who voluntarily take exposure.

Khalani uses liquidity pools in its Inter-chain Liquidity Hub to make markets for chain-specific liquidity provided to the protocol. The Inter-chain Liquidity Hub requires remote assets to be explicitly tokenized with the security assumptions of their original blockchain and cross-chain messaging, so that liquidity providers can assess infrastructure risks when taking exposure.

Khalani protects the protocol's own solvency by requiring all value transfers to pass through the Khalani Chain. This way, it maintains always up-to-date, aggregated inter-chain state for the protocol's liabilities, allowing it to cap the protocol's own exposure to external assets and blockchains, to protect the protocol from malicious attacks.

### What's your Messaging layer achitecture? Is Khalani able to connect to different types of blockchains?

While Khalani isn't specifically designed to be dependent on any specific messaging protocol, we've built our messaging layer on top of [Hyperlane](https://www.hyperlane.xyz/). Hyperlane supports permissionless integration at the messaging level and facilitates explicit definition of inter-chain security via [Inter-chain Security Modules](https://docs.hyperlane.xyz/docs/protocol/sovereign-consensus). Khalani builds its economic inter-chain primitive, the counterparties, directly on top of Hyperlane's ISMs.

Khalani is designed to connect to and cater to the liquidity needs of all blockchains, regardless of their consensus mechanisms, execution environments (EVM vs non-EVM) or ledger structures (Accounts vs UTXOs).
