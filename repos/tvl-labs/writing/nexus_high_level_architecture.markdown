# Nexus

## Motivation

-------

Khalani's vision is to be a multi-chain native stable coin with unified liquidity across all the blockchains and the Khalani Chain is built as the liquidity hub for the Khalani ecosystem. We expect the main apps in the Khalani ecosystem, such as cross-chain bridging, trading and lending built on the Khalani Chain. Therefore, it's necessary to build a hub-and-spoke based messaging system having the Khalani Chain in the center that connects to all other blockchains.

We call this system Nexus.

## Functional Requirements

-------

Security:

This is the most important requirement of Nexus. For each Nexus spoke, we should only need to trust the consensus of the two blockchains and nothing else.

Scalability:

Nexus should be able to scale to all types of blockchains easily without having to custom build the messaging infrastructure for each one or each type.

## Technical Requirements

-------

Nexus has to guarantee that for each spoke:

- all messages are delivered once and once only.
- in their sent order on the source chain.
- All invalid messages should be rejected.
- All token accounting (locking, unlocking, burning, minting) associated with messages should be kept with integrity.


- Must have the ability to me



### Out of Scope

- Developing Bespoke AMB: We plan on aggregating existing solutions.

## Solution

-------

We're building Nexus as a meta messaging protocol. For each spoke, we'd rely on either complete trustless verification (on-chain light clients), or a whitelisted external validation based system + an independent verification factor bound by the Khalani Chain's consensus.

### Design Considerations

#### Interchain Accounts (ICA)

In order to maintain full expressiveness of user interactions, we will deploy deterministic accounts accounts which will act as a proxy to the user's remote account. This will in turn , allow users interact programmatically with assets and other applications deployed on the Khala chain.

#### Fall backs



##### Implementation

- The calls happen as normal on the destination chain
- On Axon receiver , we require the additional logic to check if the user possess an interchain account. If not , we create it for them.

```solidity
   function depositTokenAndCall(
       address account,
       address token,
       uint256 amount,
       uint32 chainId,
       bytes32 toContract,
       bytes memory data
   ) internal nonReentrant {
       require(data.length > 0 , "empty call data");
       LogDepositAndCall(
           token,
           account,
           amount,
           chainId
       );
 
       if !(account in khalaWallets) {
           createKhalaWallet()
       }
 
       s.balances[account][token] += amount;
       IERC20Mintable(token).mint(address(account),amount);
       _proxyCall(toContract,data);
   }
```

#### 2nd Factor

Different bridges make different comprises with regards to security and latency. In addition to this, relying a single validation mechanism means that failure it compromises the security of its applications.

Our solution to this borrows from Hyperlane's Interchain Security Module, as allows to combine multiple validations before processing or rejecting a message.

##### Implementation


```solidity


contract KhalaIsm is IMultisigIsm, Ownable {


    


}
```

#### Gas

There are computation costs that need to be paid for one the source and destination chains. While the source chain gas costs are explicit , payments to the relayers are not always clear cut , with some opting to directly pay the relayers gas costs (i.e. Hyperlane), which others charge execution costs based on a basefee, length and fee per byte (i.e. Celer).

Gas payments will be managed by deferring to the mechanism used by the AMB, and will be payable in Ether, using [Meta-transactions](https://docs.openzeppelin.com/learn/sending-gasless-transactions) if necessary to order to improve UX.

##### Implementation

## Specification

-------

### Philosophy

In order meet with scalability requirement , we adopt the [Diamond Standard - Multi Facet Proxy](https://eips.ethereum.org/EIPS/eip-2535), encapsulating each AMB's logic in individual facets. This also allows us to safely adds new facets to our contracts - extensibility.

### Smart Contracts

#### Language

[Solidity](https://docs.soliditylang.org/en/v0.8.17/).

#### Development Toolchain

[Foundry](https://github.com/foundry-rs/foundry).

#### Significant Contracts

#### Nexus Diamond

- NexusGateWay.sol : This acts as the entry point of the diamond is a able route calls to facets to appropriate storages by matching them against their function selectors.
  - Imports: `LibAppStorage.sol`, `IDiamondCut.sol` , `IERC173.sol` , `IERC165.sol`, `LibDiamondStorage.sol`.
  - Constructor

            ```solidity
            constructor(IDiamondCut.FacetCut[] memory _diamondCut, DiamondArgs memory _args) payable {}
            ```

- AxonReceiver.sol :

- Bridges: These represent contracts that are capable of mediating messages between different AMBs.
  - AxonHandler.sol:

##### Facets

#### Interfaces

## Resources

- [How Do Meta-transactions Reduce the Barriers to Web3?](https://www.biconomy.io/post/how-do-meta-transactions-reduce-the-barriers-to-web3)
- [Open Gas Network](https://github.com/opengsn/gsn)


- TODO:
    - Specification
      - Resolution
        - Diagram
        - More thorough design on second factor

- Fallbacks