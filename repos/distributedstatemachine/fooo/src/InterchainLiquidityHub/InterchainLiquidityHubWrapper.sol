pragma solidity ^0.8.0;
import {BatchSwapStep, FundManagement, IVault, IAsset, IBalancerPool} from "./BalancerTypes.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../InterchainMessaging/Token.sol";
import "../InterchainMessaging/facets/Bridge/BridgeFacet.sol";
import "./LibEncode.sol";
import "../LiquidityReserves/LibBatchTokenOp.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract InterchainLiquidityHubWrapper is ReentrancyGuard{
    address public immutable balancerVault;
    address public immutable interchainMessagingGateway;

    constructor(address _balancerVault, address _interchainMessagingGateway) {
        interchainMessagingGateway = _interchainMessagingGateway;
        balancerVault = _balancerVault;
    }

    event SwapExecuted(
        address indexed sender,
        address indexed recipient,
        IAsset[] assets
    );

    event LiquidityWithdrawn(
        uint256 indexed chainId,
        address indexed sender,
        address indexed recipient,
        Token[] tokens
    );

    /**
    * @notice Executes a swap on Balancer and sends the resulting tokens to the sender
    * @param swaps Encoded swaps to execute
    * @param swapCount Number of swaps encoded in the swaps parameter
    * @param assets Assets involved in the swap
    * @param limits Limits for each asset
    * @param deadline Deadline for the swap
    * @return tokens Tokens received from the swap
    */
    function executeSwap(
        bytes calldata swaps,
        uint swapCount,
        IAsset[] memory assets,
        int256[] memory limits,
        uint256 deadline
    ) external nonReentrant payable returns (Token[] memory tokens) {
        if(swaps.length == 0 || swapCount==0) revert InterchainLiquidityHubWrapper__NoSwapsToExecute();
        if(assets.length == 0) revert InterchainLiquidityHubWrapper__NoAssetsToSwap();
        _transferAndApproveAssets(assets, limits);

        FundManagement memory funds;
        funds.sender = address(this);
        funds.fromInternalBalance = false;
        funds.toInternalBalance = false;
        funds.recipient = payable(msg.sender);

        BatchSwapStep[] memory batchSwaps = LibEncode.decodePacked(
            swaps,
            swapCount
        );

        int[] memory assetDeltas = IVault(balancerVault).batchSwap(
            IVault.SwapKind.GIVEN_IN,
            batchSwaps,
            assets,
            funds,
            limits,
            deadline
        );

        emit SwapExecuted(msg.sender, funds.recipient, assets);
        tokens = getOutTokens(assets, assetDeltas);
    }

    /**
    * @notice Executes a swap on Balancer to swap BPT tokens for a mirror token and bridge the mirror token to a chain-id
    * @param chainId Chain id to bridge to
    * @param receiver Address to receive the bridged tokens
    * @param swaps Balancer's BatchSwapSteps Array
    * @param assets Assets involved in the swap
    * @param limits Limits for each asset
    * @param deadline Deadline for the swap
    * @return tokens Tokens received from the swap
    */
    function withdrawLiquidity(
        uint256 chainId,
        address receiver,
        BatchSwapStep[] calldata swaps,
        IAsset[] memory assets,
        int256[] memory limits,
        uint256 deadline
    ) external nonReentrant payable returns (Token[] memory tokens) {
        if(swaps.length == 0) revert InterchainLiquidityHubWrapper__NoSwapsToExecute();
        if(assets.length == 0) revert InterchainLiquidityHubWrapper__NoAssetsToSwap();
        _transferAndApproveAssets(assets, limits);

        FundManagement memory funds;
        funds.sender = address(this);
        funds.fromInternalBalance = false;
        funds.toInternalBalance = false;
        funds.recipient = payable(address(this));

        int[] memory assetDeltas = IVault(balancerVault).batchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            assets,
            funds,
            limits,
            deadline
        );

        emit SwapExecuted(msg.sender, funds.recipient, assets);

        tokens = getOutTokens(assets, assetDeltas);

        LibBatchTokenOp._approveTokens(tokens, BridgeFacet(interchainMessagingGateway).getLiquidityProjector());

        BridgeFacet(interchainMessagingGateway).send{value : msg.value}(
            block.chainid,
            msg.sender,
            chainId,
            tokens,
            receiver,
            bytes("")
        );

        emit LiquidityWithdrawn(chainId, msg.sender, receiver, tokens);
    }

    function _transferAndApproveAssets(
        IAsset[] memory assets,
        int256[] memory limits
    ) private {
        for (uint i; i < limits.length; ) {
            if (limits[i] > 0) {
                IERC20 token = IERC20(address(assets[i]));
                uint256 limit = uint256(limits[i]);

                SafeERC20.safeTransferFrom(
                    token,
                    msg.sender,
                    address(this),
                    limit
                );
                token.approve(balancerVault, limit);
            }
            unchecked {
                ++i;
            }
        }
    }

    function getOutTokens(
        IAsset[] memory assets,
        int[] memory assetDeltas
    ) private pure returns (Token[] memory) {
        uint256 size = 0;
        for (uint i; i < assetDeltas.length; ) {
            if (assetDeltas[i] < 0) {
                size++;
            }
            unchecked {
                ++i;
            }
        }

        Token[] memory tokens = new Token[](size);
        uint j = 0;
        for (uint i; i < assetDeltas.length; ) {
            if (assetDeltas[i] < 0) {
                tokens[j++] = Token(
                    address(assets[i]),
                    uint(assetDeltas[i] * -1)
                );
            }
            unchecked {
                ++i;
            }
        }

        return tokens;
    }
}
