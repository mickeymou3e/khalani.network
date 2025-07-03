pragma experimental ABIEncoderV2;
import './IERC20.sol';
import './IAsset.sol';

pragma solidity 0.8.12;

/**
 * @dev Full external interface for the Vault core contract - no external or public methods exist in the contract that
 * don't override one of these declarations.
 */
interface IVault {
  /**
   * @dev Returns detailed information for a Pool's registered token.
   *
   * `cash` is the number of tokens the Vault currently holds for the Pool. `managed` is the number of tokens
   * withdrawn and held outside the Vault by the Pool's token Asset Manager. The Pool's total balance for `token`
   * equals the sum of `cash` and `managed`.
   *
   * Internally, `cash` and `managed` are stored using 112 bits. No action can ever cause a Pool's token `cash`,
   * `managed` or `total` balance to be greater than 2^112 - 1.
   *
   * `lastChangeBlock` is the number of the block in which `token`'s total balance was last modified (via either a
   * join, exit, swap, or Asset Manager update). This value is useful to avoid so-called 'sandwich attacks', for
   * example when developing price oracles. A change of zero (e.g. caused by a swap with amount zero) is considered a
   * change for this purpose, and will update `lastChangeBlock`.
   *
   * `assetManager` is the Pool's token Asset Manager.
   */
  function getPoolTokenInfo(
    bytes32 poolId,
    IERC20 token
  )
    external
    view
    returns (
      uint256 cash,
      uint256 managed,
      uint256 lastChangeBlock,
      address assetManager
    );

  /**
   * @dev Returns a Pool's registered tokens, the total balance for each, and the latest block when *any* of
   * the tokens' `balances` changed.
   *
   * The order of the `tokens` array is the same order that will be used in `joinPool`, `exitPool`, as well as in all
   * Pool hooks (where applicable). Calls to `registerTokens` and `deregisterTokens` may change this order.
   *
   * If a Pool only registers tokens once, and these are sorted in ascending order, they will be stored in the same
   * order as passed to `registerTokens`.
   *
   * Total balances include both tokens held by the Vault and those withdrawn by the Pool's Asset Managers. These are
   * the amounts used by joins, exits and swaps. For a detailed breakdown of token balances, use `getPoolTokenInfo`
   * instead.
   */
  function getPoolTokens(
    bytes32 poolId
  )
    external
    view
    returns (
      IERC20[] memory tokens,
      uint256[] memory balances,
      uint256 lastChangeBlock
    );

  enum SwapKind {
    GIVEN_IN,
    GIVEN_OUT
  }

  /**
   * @dev Performs a swap with a single Pool.
   *
   * If the swap is 'given in' (the number of tokens to send to the Pool is known), it returns the amount of tokens
   * taken from the Pool, which must be greater than or equal to `limit`.
   *
   * If the swap is 'given out' (the number of tokens to take from the Pool is known), it returns the amount of tokens
   * sent to the Pool, which must be less than or equal to `limit`.
   *
   * Internal Balance usage and the recipient are determined by the `funds` struct.
   *
   * Emits a `Swap` event.
   */
  function swap(
    SingleSwap memory singleSwap,
    FundManagement memory funds,
    uint256 limit,
    uint256 deadline
  ) external payable returns (uint256);

  /**
   * @dev Data for a single swap executed by `swap`. `amount` is either `amountIn` or `amountOut` depending on
   * the `kind` value.
   *
   * `assetIn` and `assetOut` are either token addresses, or the IAsset sentinel value for ETH (the zero address).
   * Note that Pools never interact with ETH directly: it will be wrapped to or unwrapped from WETH by the Vault.
   *
   * The `userData` field is ignored by the Vault, but forwarded to the Pool in the `onSwap` hook, and may be
   * used to extend swap behavior.
   */
  struct SingleSwap {
    bytes32 poolId;
    SwapKind kind;
    IAsset assetIn;
    IAsset assetOut;
    uint256 amount;
    bytes userData;
  }

  /**
   * @dev Performs a series of swaps with one or multiple Pools. In each individual swap, the caller determines either
   * the amount of tokens sent to or received from the Pool, depending on the `kind` value.
   *
   * Returns an array with the net Vault asset balance deltas. Positive amounts represent tokens (or ETH) sent to the
   * Vault, and negative amounts represent tokens (or ETH) sent by the Vault. Each delta corresponds to the asset at
   * the same index in the `assets` array.
   *
   * Swaps are executed sequentially, in the order specified by the `swaps` array. Each array element describes a
   * Pool, the token to be sent to this Pool, the token to receive from it, and an amount that is either `amountIn` or
   * `amountOut` depending on the swap kind.
   *
   * Multihop swaps can be executed by passing an `amount` value of zero for a swap. This will cause the amount in/out
   * of the previous swap to be used as the amount in for the current one. In a 'given in' swap, 'tokenIn' must equal
   * the previous swap's `tokenOut`. For a 'given out' swap, `tokenOut` must equal the previous swap's `tokenIn`.
   *
   * The `assets` array contains the addresses of all assets involved in the swaps. These are either token addresses,
   * or the IAsset sentinel value for ETH (the zero address). Each entry in the `swaps` array specifies tokens in and
   * out by referencing an index in `assets`. Note that Pools never interact with ETH directly: it will be wrapped to
   * or unwrapped from WETH by the Vault.
   *
   * Internal Balance usage, sender, and recipient are determined by the `funds` struct. The `limits` array specifies
   * the minimum or maximum amount of each token the vault is allowed to transfer.
   *
   * `batchSwap` can be used to make a single swap, like `swap` does, but doing so requires more gas than the
   * equivalent `swap` call.
   *
   * Emits `Swap` events.
   */
  function batchSwap(
    SwapKind kind,
    BatchSwapStep[] memory swaps,
    IAsset[] memory assets,
    FundManagement memory funds,
    int256[] memory limits,
    uint256 deadline
  ) external payable returns (int256[] memory);

  /**
   * @dev Data for each individual swap executed by `batchSwap`. The asset in and out fields are indexes into the
   * `assets` array passed to that function, and ETH assets are converted to WETH.
   *
   * If `amount` is zero, the multihop mechanism is used to determine the actual amount based on the amount in/out
   * from the previous swap, depending on the swap kind.
   *
   * The `userData` field is ignored by the Vault, but forwarded to the Pool in the `onSwap` hook, and may be
   * used to extend swap behavior.
   */
  struct BatchSwapStep {
    bytes32 poolId;
    uint256 assetInIndex;
    uint256 assetOutIndex;
    uint256 amount;
    bytes userData;
  }

  /**
   * @dev Emitted for each individual swap performed by `swap` or `batchSwap`.
   */
  event Swap(
    bytes32 indexed poolId,
    IERC20 indexed tokenIn,
    IERC20 indexed tokenOut,
    uint256 amountIn,
    uint256 amountOut
  );

  /**
   * @dev All tokens in a swap are either sent from the `sender` account to the Vault, or from the Vault to the
   * `recipient` account.
   *
   * If the caller is not `sender`, it must be an authorized relayer for them.
   *
   * If `fromInternalBalance` is true, the `sender`'s Internal Balance will be preferred, performing an ERC20
   * transfer for the difference between the requested amount and the User's Internal Balance (if any). The `sender`
   * must have allowed the Vault to use their tokens via `IERC20.approve()`. This matches the behavior of
   * `joinPool`.
   *
   * If `toInternalBalance` is true, tokens will be deposited to `recipient`'s internal balance instead of
   * transferred. This matches the behavior of `exitPool`.
   *
   * Note that ETH cannot be deposited to or withdrawn from Internal Balance: attempting to do so will trigger a
   * revert.
   */
  struct FundManagement {
    address sender;
    bool fromInternalBalance;
    address payable recipient;
    bool toInternalBalance;
  }

  /**
   * @dev Simulates a call to `batchSwap`, returning an array of Vault asset deltas. Calls to `swap` cannot be
   * simulated directly, but an equivalent `batchSwap` call can and will yield the exact same result.
   *
   * Each element in the array corresponds to the asset at the same index, and indicates the number of tokens (or ETH)
   * the Vault would take from the sender (if positive) or send to the recipient (if negative). The arguments it
   * receives are the same that an equivalent `batchSwap` call would receive.
   *
   * Unlike `batchSwap`, this function performs no checks on the sender or recipient field in the `funds` struct.
   * This makes it suitable to be called by off-chain applications via eth_call without needing to hold tokens,
   * approve them for the Vault, or even know a user's address.
   *
   * Note that this function is not 'view' (due to implementation details): the client code must explicitly execute
   * eth_call instead of eth_sendTransaction.
   */
  function queryBatchSwap(
    SwapKind kind,
    BatchSwapStep[] memory swaps,
    IAsset[] memory assets,
    FundManagement memory funds
  ) external returns (int256[] memory assetDeltas);
}
