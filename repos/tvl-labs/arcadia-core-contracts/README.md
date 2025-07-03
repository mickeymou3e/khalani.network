# Arcadia Intent Protocol (AIP)
This codebase implements AIP, a smart contract protocol for asset-centric publication and resolution of Intents that involve multiple blockchains. Arcadia is an EVM based blockchain, and the Arcadia Intent Protocol (AIP) enables intent-based cross-chain interoperability. Arcadia (via AIP) acts as a hub connecting all the different chains as spokes. 

## Protocol Overview

There are a few core concepts in AIP: Receipts, Intents, MTokens and Solutions. More generally, the IntentBook contract implements an order-book like system that also takes inspiration from UTXO-style blockchains to create a "virtual" UTXO chain, but where the UTXOs are *typed*. The two kinds of virtual UTXOs are Intents and Receipts.

AIP includes two subsystems: Core and Peripheral. This codebase contains the Core system. The Core system is responsible for handling intent publication, resolution, and providing the interfaces through which the Peripheral subsystem can facilitate cross-chain interactions.

The Peripheral subsystem is actually a growing collection of (independent) implementations of various cross-chain messaging protocols that integrate with the interfaces provided by the Core system. 

Here is an overview of the Core system:
1. **MToken Manager**: The MToken Manager is responsible for maintaining a registry of authorized MToken deployments, as well as implementing an ownership model for MTokens (which is an extension of the ERC20 token standard) which allows MTokens to be *owned* by Intents and Receipts (explained below).
2. **Intent Book**: The Intent Book is the global singleton contract which stores all published Intents and verifies all Intent solutions. It manages the lifecycle of every single intent.
3. **Receipt Manager**: The Receipt Manager is responsible for issuing receipts. Receipts are issued when they are created within a solution to some set of Intents. Receipts are lightweight containers of MTokens. Receipts can also be redeemed by the ReceiptManager, which causes the Receipt's owner to receive the MToken's corresponding token on the MToken's corresponding spoke chain.
4. **MToken**: MTokens are ERC20 tokens that are associated with an ERC20 token on a particular spoke chain. The MToken's associated spoke chain and the MToken's associated ERC20 contract address on that spoke chain are stored as important, identifying metadata on the MToken. The MToken Manager will never recognize multiple MTokens if those MTokens have identical spoke chain IDs and identical spoke contract addresses.
5. **Event Prover**: The Event Prover is an interface that must be implemented on both Arcadia *and* every spoke chain. The Event Prover is named as such because it is used by an origin chain to *prove* that some event occurred on the origin chain TO some Event Verifier on a destination chain. Any Peripheral protocol must implement an Event Prover on Arcadia, an Event Prover on each spoke chain, and be listed within the EventProverRegistry on both Arcadia and every spoke chain.
6. **Event Verifier**: The Event Verifier is an interface that must be implemented on both Arcadia *and* every spoke chain. The Event Verifier receives events that are relayed by some Peripheral protocol. The Event Verifier is responsible for validating the sending relayer as well as the message relayed by that relayer to ensure it came from a valid Event Prover. An Event Verifier must be deployed on Arcadia, as well as every spoke chain *and* it must be registered in each spoke chain's EventVerifierRegistry as well as Arcadia's EventVerifierRegistry.
7. **Asset Reserves**: Asset Reserves are deployed on each spoke chain. Depositing into Asset Reserves is the only way to mint new MTokens. When a user's assets are deposited on a spoke chain into that chain's Asset Reserves, the Asset Reserves contract invokes one of the spoke chain's Event Provers. This Event Prover results in some Peripheral protocol's relayers, ultimately reaching Arcadia's Event Verifier. Once the Event Verifier on Arcadia is verified, the Event Verifier then forwards the contract to the global singleton AIPEventHandler, which will mint the appropriate MTokens.
8. **AIPEventHandler**: The AIPEventHandler is a singleton contract on both the Arcadia chain as well as each spoke chain. It is responsible for actually producing the side effects that may need to be produced by any event sent from a remote chain. The AIPEventHandler reduces the burden of integrators (teams who are building Peripheral protocols) as well, since their Event Verifiers need only perform validation and pass along the message. This also makes the system more secure, since it draws a clear line between what a Peripheral protocol can and cannot do: a Peripheral protocol cannot directly produce side effects; it must do so indirectly through the Arcadia team's AIPEventHandler. While an Event Verifier might accept messages from questionable sources, this abstraction at least ensures that any side effects produced by AIPEventHandler are logically valid. 
9. **AIPEventPublisher**: The AIPEventPublisher is a singleton contract on both the Arcadia chain as well as each spoke chain. It is responsible for actually *calling* a specific event prover on the spoke chain. This allows all contracts in AIP as well as spoke chains to not have to be coupled to a specific event prover.

### IMPORTANT NOTES

The contracts on both hub and spoke chains mostly treat event proving and verification as a black box. Contracts interact with either the AIPEventPublisher or AIPEventHandler. The AIPEventPublisher dispatches to the relevant EventProver, and then the EventVerifier on the destination chain performs validation and then hands the responsibility of actually handling the event to the AIPEventHandler. 
Every cross chain interaction has the following general workflow:
    A. From spoke chain to Arcadia: Spoke chain contract -> AIPEventPublisher -> Event Prover -> Off-chain relayer for Event Prover -> Arcadia Event Verifier -> AIPEventHandler -> Arcadia Core System contract
    B. From Arcadia to spoke chain: Arcadia Core System contract -> AIPEventPublisher -> Arcadia Event Publisher -> Off-chain relayer for Event Verifier -> Spoke chain Event Verifier -> Spoke chain AIPEventHandler -> Spoke chain contract



# Intent Examples
Note: the actual intent structures in these examples are pseudocode

## Example 1: Simple Token Swap (Token1 for Token2)

Concept: Swap an exact amount of Token1 for Exact amount ofToken2.
Irrelevant fields are omitted for brevity.

All tokens are mTokens and all srcAmounts are normalized to 18 decimals precision.
```
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [1000],
        outcomeAssetStructure: AnySingle,
        fillStructure: Exact,
    }
}
```

## Example 2: Token Swap (Token1 for Token2) with an allowed slippage of 5%

Concept: Since we want the whole thing filled rather than partially filled, we use FillStructure.Minimum.

0.05 * 1000 = 50, so we use 1000-50 as the minimum amount of Token2 we want to receive.

```
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [950],
        outcomeAssetStructure: AnySingle,
        fillStructure: Minimum,
        
    }
}

```

## Example 3: Fee Based Liquidity Provision, providing Token1 for Token2

Concept: As an LP, we do not care if our entire swap intent is filled; we are just saying our tokens are available for use but we want to get paid for it. So we use FillStructure.PercentageFilled.

For percentage, we express percentage as a number between 0 and 1000. Here we charge 1.5% fee on the amount of Token1 spent in any solution. 0-1000 because this lets us express 2 decimal places of precision on the percentage fee.

```
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address],
        mAmounts: [15],
        outcomeAssetStructure: AnySingle,
        fillStructure: PercentageFilled,
    }
}
```



## Example 4: Fee Based Liquidity Provision, providing Token1 for Token2 or Token3

Concept: As an LP, we do not care if our entire swap intent is filled; we are just saying our tokens are available for use but we want to get paid for it. So we use FillStructure.PercentageFilled.

In this case, we think Token3 is riskier than Token2, so we charge a slightly bigger fee for Token3. Our OutcomeAssetStructure can either be AnySingle OR Any. If AnySingle, it means that a solution cannot use our intent to fill trades for Token2 and Token3 in the same transaction. If Any, then it can.

We charge 1.5% fee on amount of Token1 used to purchase Token2 and 2.5% fee on amount of Token1 used to purchase Token3.

```
Intent {
    srcMToken: Token1Address,
    srcAmount: 1000,
    outcome: Outcome {
        mTokens: [Token2Address, Token3Address],
        mAmounts: [15, 25],
        outcomeAssetStructure: Any,
        fillStructure: PercentageFilled,
    }
}

```

