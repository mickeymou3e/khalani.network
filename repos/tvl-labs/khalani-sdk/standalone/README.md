# Khalani SDK Documentation

## Table of Contents

1. [Wallet Functions](#wallet-functions)
2. [Contract Functions](#contract-functions)
3. [Deposit Functions](#deposit-functions)
4. [Intent Functions](#intent-functions)
5. [Refine Functions](#refine-functions)

## Initialize Arcadia SDK

**Example**

```typescript
const arcadiaSDK = new ArcadiaSDK('EthersV5')
const walletService = arcadiaSDK.walletService
```

## Wallet Functions

### `getArcadiaChainInfo`

Returns information about Arcadia chain based on the specified network.

**Location**: Wallet class

**Parameters**: none

**Returns**:

```typescript
interface ArcadiaChainInfo {
  chainId: number
  name: string
  rpcUrl: string[]
}
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const walletService = arcadiaSDK.walletService
const chainInfo = walletService.getArcadiaChainInfo()
```

### `getArcadiaRPCUrl`

Returns the RPC URL for the Arcadia chain.

**Location**: Wallet class

**Parameters**: none

**Returns**: `string` - The RPC URL for the specified network

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const walletService = arcadiaSDK.walletService
const rpcUrl = walletService.getArcadiaRPCUrl()
```

### `getMedusaRPCUrl`

Returns the RPC URL for the Medusa service.

**Location**: Wallet class

**Parameters**: none

**Returns**: `string` - The Medusa RPC URL for the specified network

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const walletService = arcadiaSDK.walletService
const medusaUrl = walletService.getMedusaRPCUrl()
```

## Contract Functions

### `getMTokenAddress`

Returns the address of an mToken based on the underlying token and network.

**Location**: Contract class

**Parameters**:

```typescript
chainId: number // The chain id
tokenAddress: string // Spoke token address
```

**Returns**: `string` - The address of the corresponding mToken

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const contractService = arcadiaSDK.contractService
const mTokenAddress = contractService.getMTokenAddress(1, '0x1234567890abcdef')
```

### `getIntentBookABI`

Returns the constant ABI for the IntentBook contract.

**Location**: Contract class

**Parameters**: none

**Returns**: A constant value (using as const) representing the IntentBook ABI.

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const contractService = arcadiaSDK.contractService
const intentBookABI = contractService.getIntentBookABI()
```

### `getMTokenABI`

Returns the constant ABI for the MToken contract.

**Location**: Contract class

**Parameters**: none

**Returns**: A constant value (using as const) representing the MToken ABI.

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const contractService = arcadiaSDK.contractService
const mTokenABI = contractService.getMTokenABI()
```

### `getAssetReservesABI`

Returns the constant ABI for the AssetReserves contract.

**Location**: Contract class

**Parameters**: none

**Returns**: A constant value (using as const) representing the AssetReserves ABI.

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const contractService = arcadiaSDK.contractService
const mTokenABI = contractService.getAssetReservesABI()
```

## Deposit Functions

| Function                | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `ensureERC20Allowance`  | Checks and approves ERC-20 allowance if needed.        |
| `depositTraditional`    | Deposits tokens using traditional `transferFrom`.      |
| `depositWithPermit2`    | Deposits tokens using Uniswap Permit2 signed approval. |
| `populateTraditionalTx` | Builds a raw transaction for traditional deposit.      |
| `populatePermit2Tx`     | Builds a raw transaction for Permit2 deposit.          |

---

### `ensureERC20Allowance`

Ensures the AssetReserves contract has enough ERC-20 token allowance, sending an `approve` transaction if the current allowance is below the required amount.

```typescript
public async ensureERC20Allowance(
  chainId: number,
  tokenAddress: string,
  requiredAmount: bigint
): Promise<ContractTransactionReceipt | null>
```

**Location:** `DepositService` class

**Parameters:**

- `chainId` — The ID of the blockchain network (e.g., 1 for Ethereum Mainnet)
- `tokenAddress` — The ERC-20 token contract address
- `requiredAmount` — The minimum amount of tokens that must be approved

**Returns:**

- `ContractTransactionReceipt` if an approve transaction was submitted
- `null` if the existing allowance already meets or exceeds `requiredAmount`

---

### `depositTraditional`

Calls the Solidity function:

```solidity
function deposit(
  address token,
  uint256 amount,
  uint32 destChain
) external payable
```

Transfers tokens via `transferFrom` without Permit2.

```typescript
public async depositTraditional(
  tokenAddress: `0x${string}`,
  amount: bigint
): Promise<ContractTransactionReceipt>
```

**Location:** `DepositService` class

**Parameters:**

- `chainId` — Destination chain ID
- `tokenAddress` — Token contract address

**Returns:**

- `ContractTransactionReceipt` of the deposit call

---

### `depositWithPermit2`

Calls the extended Solidity function:

```solidity
function deposit(
  address token,
  uint256 amount,
  uint32 destChain,
  uint256 permitNonce,
  uint256 deadline,
  bytes signature
) external payable
```

Uses Uniswap Permit2 for off-chain approval.

```typescript
public async depositWithPermit2(
  tokenAddress: string,
  amount: bigint,
  nonce: bigint,
  deadline: bigint,
  account: string,
  signature: `0x${string}`
): Promise<ContractTransactionReceipt>
```

**Location:** `DepositService` class

**Parameters:**

- `chainId` — Destination chain ID
- `tokenAddress` — Token contract address
- `amount` — Token amount to deposit
- `nonce` — Permit2 nonce value
- `deadline` — Permit2 deadline timestamp
- `account` — Wallet address of the depositor
- `signature` — EIP-712 Permit2 signature

**Returns:**

- `ContractTransactionReceipt` of the deposit call

---

### `populateTraditionalTx`

Builds a plain transaction object for signing and broadcasting later.

```typescript
public populateTraditionalTx(
  fromChainId: number,
  toChainId: number,
  tokenAddress: string,
  tokenAmount: bigint
): PopulatedTransaction
```

**Location:** `DepositService` class

**Returns:**

- A `PopulatedTransaction` ready to be signed

---

### `populatePermit2Tx`

Builds a plain transaction object for Permit2 deposit.

```typescript
public populatePermit2Tx(args: {
  fromChainId: number
  toChainId: number
  tokenAddress: string
  tokenAmount: bigint
  permitNonce: bigint
  deadline: bigint
  signature: `0x${string}`
}): PopulatedTransaction
```

**Location:** `DepositService` class

**Returns:**

- A `PopulatedTransaction` ready to be signed

---

### `getGasValue`

Returns the gas value needed to cover the protocol fee when calling deposit functions.

```typescript
public getGasValue = (): BigNumber
```

**Location:** `DepositService` class

**Returns:**

- A `BigNumber` ready to be passed

---

## Usage Example

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const sdk = new ArcadiaSDK('EthersV5')
const depositService = sdk.depositService

// 1. Traditional flow:
await depositService.ensureERC20Allowance(1, tokenAddress, amount)
const receipt1 = await depositService.depositTraditional(
  1,
  tokenAddress,
  amount,
)

// 2. Permit2 flow:
const { nonce, deadline, signature } = await depositService.signPermit2Message(
  1,
  tokenAddress,
  amount,
  intentNonce,
  intentDeadline,
)
const receipt2 = await depositService.depositWithPermit2(
  1,
  tokenAddress,
  amount,
  nonce,
  deadline,
  sdk.wallet.getUserAddress(),
  signature,
)

// 3. Or build raw tx:
const txData = depositService.populateTraditionalTx(1, 5, tokenAddress, amount)
// sign & send txData with your wallet…
```

## Intent Functions

### `buildSignIntentPayload`

Creates a payload for signing an intent.

**Location**: Intent service

**Parameters**:

```typescript
interface SignIntentPayloadProps {
  refineResult: {
    outcome: {
      author: string
      ttl: string
      nonce: string
      srcMToken: string
      srcAmount: string
      outcome: {
        mAmounts: string[]
        mTokens: string[]
        outcomeAssetStructure: string
        fillStructure: string
      }
    }
  }
  account: string
}
```

**Returns**:

```typescript
interface SignIntentPayload {
  domain: typeof intentDomain
  types: typeof intentTypes
  message: {
    author: `0x${string}`
    ttl: bigint
    nonce: bigint
    srcMToken: `0x${string}`
    srcAmount: bigint
    outcome: {
      mTokens: `0x${string}`[]
      mAmounts: bigint[]
      outcomeAssetStructure: OutcomeAssetStructure
      fillStructure: FillStructure
    }
  }
  primaryType: string
  account: string
}
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const intentService = arcadiaSDK.intentService
const signPayload = intentService.buildSignIntentPayload({
  refineResult: {
    outcome: {
      author: '0xSenderAddress',
      ttl: '1234567890',
      nonce: '1',
      srcMToken: '0xTokenAddress',
      srcAmount: '1000000000000000000',
      outcome: {
        mAmounts: ['1000000000000000000'],
        mTokens: ['0xReceiverTokenAddress'],
        outcomeAssetStructure: 'AnySingle',
        fillStructure: 'Exact',
      },
    },
  },
  account: '0xSenderAddress',
})
```

### `proposeIntent`

Proposing a new intent.

**Location**: Intent service

**Parameters**:

```typescript
interface ProposeIntentPayloadProps {
  refineResult: {
    outcome: {
      author: string
      ttl: string
      nonce: string
      srcMToken: string
      srcAmount: string
      outcome: {
        mAmounts: string[]
        mTokens: string[]
        outcomeAssetStructure: string
        fillStructure: string
      }
    }
  }
  signature: string
}
```

**Returns**:

```typescript
type ProposeIntentResult = string
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const intentService = arcadiaSDK.intentService
const refineResult = {
  outcome: {
    author: '0xAuthorAddress',
    ttl: '1234567890',
    nonce: '1',
    srcMToken: '0xTokenAddress',
    srcAmount: '1000000000000000000',
    outcome: {
      mAmounts: ['2000000000000000000'],
      mTokens: ['0xTargetTokenAddress'],
      outcomeAssetStructure: 'AnySingle',
      fillStructure: 'Exact',
    },
  },
}

const signature = '0xSignatureHex'
const proposePayload = intentService.proposeIntent(refineResult, signature)
```

### `getIntentStatus`

Querying the status of an intent.

**Location**: Intent service

**Parameters**:

```typescript
interface GetIntentStatusPayloadProps {
  intentId: string
}
```

**Returns**:

```typescript
enum RpcIntentState {
  NonExistent = 'NonExistent',
  Open = 'Open',
  Locked = 'Locked',
  Solved = 'Solved',
  Settled = 'Settled',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
}
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const intentService = arcadiaSDK.intentService
const statusPayload = intentService.buildGetIntentStatusPayload({
  intentId: '0x123456789abcdef',
})
```

### `buildGetIntentNoncePayload`

Creates a payload for getting the next nonce for an intent.

**Location**: Intent service

**Parameters**:

```typescript
interface GetIntentNoncePayloadProps {
  address: string // Address to get the nonce for
}
```

**Returns**:

```typescript
interface GetIntentNoncePayload {
  name: string // RPC method name
  params: string[]
  abi: InterfaceAbi
}
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const intentService = arcadiaSDK.intentService
const noncePayload = intentService.buildGetIntentNoncePayload({
  address: '0xUserWalletAddress',
})
```

## Refine Functions

### `createRefine`

Creating a new Refine transaction.

**Location**: Refine service

**Parameters**:

```typescript
interface CreateRefinePayloadProps {
  args: {
    accountAddress: string
    fromChainId: number
    fromTokenAddress: string
    amount: bigint
    toChainId: number
    toTokenAddress: string
    currentNonce: bigint
  }
}
```

**Returns**:

The `createRefine` function returns an ID that can be used later to query Refine

```typescript
type CreateRefineResult = string
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const refineService = arcadiaSDK.refineService
const createPayload = refineService.createRefine({
  accountAddress: '0xSenderAddress',
  fromChainId: 31337,
  fromTokenAddress: '0xTokenAddress',
  amount: BigInt('1000000000000000000'),
  toChainId: 31337,
  toTokenAddress: '0xTokenAddress',
  currentNonce: BigInt(1),
})
```

### `queryRefine`

Querying information about a Refine transaction.

**Location**: Refine service

**Parameters**:

```typescript
interface QueryRefinePayloadProps {
  refineId: string // ID of the Refine transaction to query
}
```

**Returns**:

```typescript
export type RefineResultOrNotFound = RefineResult | RefineResultStatus

export interface RefineResult {
  Refinement: {
    author: string
    ttl: string
    nonce: string
    srcMToken: string
    srcAmount: string
    outcome: {
      mAmounts: string[]
      mTokens: string[]
      outcomeAssetStructure: string
      fillStructure: string
    }
  }
}

export enum RefineResultStatus {
  RefinementNotFound = 'RefinementNotFound',
}
```

**Example**:

```typescript
import { ArcadiaSDK } from 'arcadia-sdk-wip'

const arcadiaSDK = new ArcadiaSDK('EthersV5')
const refineService = arcadiaSDK.refineService
const queryPayload = refineService.queryRefine('0x123456789abcdef')
```

## Notes

This documentation provides detailed interface definitions for the main functions in the Khalani SDK standalone module. For complete usage documentation, refer to the full SDK documentation. Each function's actual implementation may require additional parameters or have specific behavior based on the network or context.

To use these functions, you'll typically need to initialize the appropriate service or utility class with configuration settings specific to your environment.
