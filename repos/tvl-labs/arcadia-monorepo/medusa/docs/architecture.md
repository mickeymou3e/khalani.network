# Medusa Service Architecture

## Overview

This document outlines the proposed architecture for the Medusa Service, including the main components, data structures, and high-level workflows.
Medusa has an API for client-side applications to submitt trade requests (called "Intents"), as well as a websockets api for agents called "Solvers" to subscribe to, 
which notifies them when intents are received by Medusa and allows solvers to submit fill orders.

## Components

1. API Server
2. WebSocket Server
3. Blockchain Interaction Module

## Data Structures

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename = "OutcomeAssetStructure")]
pub enum OutcomeAssetStructure {
    AnySingle,
    Any,
    All,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename = "FillStructure")]
pub enum FillStructure {
    Exact,
    Minimum,
    PercentageFilled,
    ConcreteRange,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Outcome {
    pub m_tokens: Vec<Address>,
    pub m_amounts: Vec<U256>,
    pub outcome_asset_structure: OutcomeAssetStructure,
    pub fill_structure: FillStructure,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Intent {
    pub author: Address,
    pub ttl: U256,
    pub nonce: U256,
    pub src_m_token: Address,
    pub src_amount: U256,
    pub outcome: Outcome,
    pub sig: Signature,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum IntentState {
    NonExistent,
    Open,
    Locked,
    Solved,
    Settled,
    Expired,
    Cancelled,
}


```

### Examples of how to express different kinds of orders using the intent structure
Note: the actual intent structures in these examples are pseudocode

#### Example 1: Simple Token Swap (Token1 for Token2)

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

#### Example 2: Token Swap (Token1 for Token2) with an allowed slippage of 5%

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

#### Example 3: Fee Based Liquidity Provision, providing Token1 for Token2

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



#### Example 4: Fee Based Liquidity Provision, providing Token1 for Token2 or Token3

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

## Workflows

(Please describe your high-level workflows here)

## API Endpoints

1. General Endpoints:
   - POST /intents
   - GET /intents/:id
   - POST /intents/:id/cancel
   - GET /intents
   - GET /user/:address
   - POST /admin/lock_intents
   - POST /admin/commit_solution
   - POST /receipts
   - POST /receipts/:id/redeem
   - GET /receipts

2. WebSocket Endpoints:
   - GET /ws
   - POST /ws/intents/solutions
   - GET /ws/solutions
   - GET /ws/solvers
   - GET /ws/solvers/:id/solutions
   - POST /ws/solutions/:id/update

3. Specialized Intent Creation Endpoints:
   - POST /intents/bridge
   - POST /intents/bridge/multi
   - POST /intents/swap
   - POST /intents/provide-liquidity
   - POST /intents/swap/multi-asset
   - POST /intents/swap/partial-fill
   - POST /intents/swap/range
   - POST /intents/swap/best-effort

4. Deprecated or Redundant Endpoints:
   - POST /intents/types/bridge/single
   - POST /intents/types/bridge/multi
   - POST /intents/types/swap/simple
   - POST /intents/types/swap/multi
   - POST /intents/types/swap/range
   - POST /intents/types/swap/partial

## WebSocket Events

The WebSocket server broadcasts the following events to connected clients:

1. Intent Updates:
   - Event: `intent_update`
   - Data: 
     ```json
     {
       "intent_id": "string",
       "state": "Open | Locked | Solved | Settled | Expired | Cancelled"
     }
     ```
   - Description: Sent when an intent's state changes.

2. New Intent:
   - Event: `new_intent`
   - Data: 
     ```json
     {
       "type": "new_intent",
       "intent": {
         "author": "0x1234...",
         "ttl": "1234567890",
         "nonce": "1",
         "srcMToken": "0xabcd...",
         "srcAmount": "1000000000000000000",
         "outcome": {
           "mTokens": ["0xdef0...", "0x9876..."],
           "mAmounts": ["900000000000000000", "100000000000000000"],
           "outcomeAssetStructure": "Any",
           "fillStructure": "Exact"
         },
         "sig": "0x..."
       }
     }
     ```
   - Description: Broadcast when a new intent is created in the system.

3. Solution Updates:
   - Event: `solution_update`
   - Data:
     ```json
     {
       "solution_id": "string",
       "state": "Proposed | Accepted | Rejected | Executed"
     }
     ```
   - Description: Sent when a solution's state changes.

4. Solver API Events:
   - Event: `solver_api`
   - Data: Varies based on the specific API call
   - Description: Used for solver-specific communications, such as requesting or submitting solutions.

Clients can subscribe to these events by connecting to the WebSocket endpoint (`/ws`). Solvers, in particular, should listen for `new_intent` and `intent_update` events to stay informed about potential intents they could solve.

The WebSocket server also handles incoming messages from clients, particularly for solvers to submit solutions (`/ws/intents/solutions`) and update solution states (`/ws/solutions/:id/update`).


## Smart Contract Interactions

Medusa interacts with several smart contracts deployed on the blockchain. These interactions are primarily managed through the Blockchain Interaction Module. The main contracts and their interactions are as follows:

1. Intent Book (ClearanceEngine.sol):
   - Purpose: Manages the lifecycle of intents.
   - Interactions:
     - Post new intents
     - Lock intents for solving
     - Cancel intents
     - Query intent states

2. MToken Manager (MTokenManager.sol):
   - Purpose: Manages the mTokens used in the system.
   - Interactions:
     - Query mToken information
     - Verify mToken validity
     - Enable mTokens deposit into receipts
     - Enable mToken withdrawal from Receipt Managers

3. Receipt Manager (ReceiptManager.sol):
   - Purpose: Handles the creation and redemption of receipts.
   - Interactions:
     - Create new receipts
     - Redeem receipts
     - Query receipt status

4. MTokens (MToken.sol):
   - Purpose: Represents the tokens used within the Arcadia system.
   - Interactions:
     - Transfer mTokens
     - Use within receipts
     - Query balances
     - Approve spending
     - Tracks the origin chain whose asset reserves contains corresponding tokens

Workflows:

- Intent Lifecycle:
  1. When a new intent is received via the API, it's posted to the Intent Book contract and simultaneously broadcast to solvers
  2. Solvers can lock intents they want to solve.
  3. Solutions are submitted and verified on-chain.
  4. Intents can be cancelled by their authors if not yet solved.

- Solution Execution:
  1. When a solution is accepted, the relevant mTokens are transferred according to the solution.
  2. Receipts are created for cross-chain transfers.

- Receipt Handling:
  1. Receipts are created when intents are spent within the inputs of a Solution and when the intent solution does not require the creation of a fresh intent in the next state
  2. Users can redeem receipts to claim their tokens on the destination chain.

The Chain Service module uses the ABIs stored in the `contracts_path` to interact with these contracts. The addresses of these contracts are configured in the `config/chain/dev.toml` file and loaded into the `ChainConfig` struct (currently just use env vars)
