pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/InterchainMessaging/Token.sol";
import "../src/InterchainLiquidityHub/InterchainLiquidityHubWrapper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Mock/MockBalancerVault.sol";
import "./Mock/MockBridgeFacet.sol";
import "../src/InterchainLiquidityHub/LibEncode.sol";

contract InterchainLiquidityHubWrapperTest is Test {
    address interchainMessageGateway;
    IERC20 usdcEth;
    IERC20 usdcAvax;
    IERC20 klnUsdc;
    IERC20 klnUsdt;
    IERC20 bpt;
    MockBalancerVault mockVault;
    InterchainLiquidityHubWrapper ilh;

    function setUp() public {
        interchainMessageGateway = address(new MockBridgeFacet());
        klnUsdc = IERC20(new ERC20MintableBurnable("klnUSDC", "klnUSDC"));
        klnUsdt = IERC20(new ERC20MintableBurnable("klnUSDT", "klnUSDT"));
        usdcEth = IERC20(new ERC20MintableBurnable("USDC.ETH", "USDC/ETH"));
        usdcAvax = IERC20(new ERC20MintableBurnable("USDC.AVAX", "USDC/AVAX"));
        bpt = IERC20(new ERC20MintableBurnable("BPT", "BPT"));
        mockVault = new MockBalancerVault(address(bpt));
        mockVault.setPass(true);
        deal(address(bpt), address(mockVault), type(uint256).max);
        ilh = new InterchainLiquidityHubWrapper(
            address(mockVault),
            interchainMessageGateway
        );
    }

    //add liquidty
    function test_executeSwap_Single(int amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        address user = vm.addr(1);
        deal(address(usdcEth), user, amount);

        IAsset[] memory _assets = new IAsset[](2);
        _assets[0] = IAsset(address(usdcEth));
        _assets[1] = IAsset(address(bpt));

        BatchSwapStep[] memory swaps = new BatchSwapStep[](1);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 1,
            amount: amount,
            userData: bytes("")
        });

        (bytes memory encodedSwaps, uint256 swapCount) = LibEncode.encodePack(
            swaps
        );

        int256[] memory limits = mockVault.queryBatchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(user),
                toInternalBalance: false
            })
        );

        assertEq(usdcEth.balanceOf(user), amount);
        assertEq(bpt.balanceOf(user), 0);

        vm.startPrank(user);
        IERC20(address(usdcEth)).approve(address(ilh), amount);
        vm.expectEmit(address (ilh));
        emit SwapExecuted(
            user,
            user,
            _assets
        );
        Token[] memory outToken = ilh.executeSwap(
            encodedSwaps,
            swapCount,
            _assets,
            limits,
            block.timestamp
        );
        vm.stopPrank();

        assertEq(outToken.length, 1);
        assertEq(outToken[0].tokenAddress, address(bpt));
        assertEq(outToken[0].amount, amount);
        assertEq(usdcEth.balanceOf(user), 0);
        assertEq(bpt.balanceOf(user), amount);
    }

    //bridge tokens
    function test_executeSwap_Batch(int amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        address user = vm.addr(1);
        deal(address(usdcAvax), address(mockVault), amount);
        deal(address(usdcEth), user, amount);

        IAsset[] memory _assets = new IAsset[](3);
        _assets[0] = IAsset(address(usdcEth));
        _assets[1] = IAsset(address(usdcAvax));
        _assets[2] = IAsset(address(klnUsdc));

        BatchSwapStep[] memory swaps = new BatchSwapStep[](2);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 2,
            amount: amount,
            userData: bytes("")
        });
        swaps[1] = BatchSwapStep({
            poolId: bytes32("2"),
            assetInIndex: 2,
            assetOutIndex: 1,
            amount: 0,
            userData: bytes("")
        });

        (bytes memory encodedSwaps, uint256 swapCount) = LibEncode.encodePack(
            swaps
        );

        int256[] memory limits = mockVault.queryBatchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(user),
                toInternalBalance: false
            })
        );

        assertEq(usdcEth.balanceOf(user), amount);
        assertEq(bpt.balanceOf(user), 0);

        vm.startPrank(user);
        IERC20(address(usdcEth)).approve(address(ilh), amount);
        vm.expectEmit(address (ilh));
        emit SwapExecuted(
            user,
            user,
            _assets
        );
        Token[] memory outToken = ilh.executeSwap(
            encodedSwaps,
            swapCount,
            _assets,
            limits,
            block.timestamp
        );
        vm.stopPrank();

        assertEq(outToken.length, 1);
        assertEq(outToken[0].tokenAddress, address(usdcAvax));
        assertEq(usdcEth.balanceOf(user), 0);
        assertEq(usdcAvax.balanceOf(user), amount);
    }

    function test_WithdrawLiquidityToRemote(int amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        address user = vm.addr(1);

        vm.prank(address(mockVault));
        bpt.transfer(user, amount);
        deal(address(usdcEth), address(mockVault), amount);

        IAsset[] memory _assets = new IAsset[](2);
        _assets[0] = IAsset(address(bpt));
        _assets[1] = IAsset(address(usdcEth));

        BatchSwapStep[] memory swaps = new BatchSwapStep[](1);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 1,
            amount: amount,
            userData: bytes("")
        });

        int256[] memory limits = mockVault.queryBatchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(user),
                toInternalBalance: false
            })
        );

        assertEq(usdcEth.balanceOf(user), 0);
        assertEq(bpt.balanceOf(user), amount);

        vm.startPrank(user);
        IERC20(address(bpt)).approve(address(ilh), amount);
        Token[] memory expectedOutTokens = new Token[](1);
        expectedOutTokens[0] = Token({
            tokenAddress: address(usdcEth),
            amount: amount
        });
        //Swap Executed Event
        vm.expectEmit(address (ilh));
        emit SwapExecuted(
            user,
            address(ilh),
            _assets
        );
        //Bridge Request Event
        vm.expectEmit(interchainMessageGateway);
        emit BridgeRequest(address(ilh), 1, expectedOutTokens, vm.addr(2));
        //Withdraw Event
        vm.expectEmit(address (ilh));
        emit LiquidityWithdrawn(
            1,
            user,
            vm.addr(2),
            expectedOutTokens
        );
        Token[] memory outToken = ilh.withdrawLiquidity(
            1,
            vm.addr(2),
            swaps,
            _assets,
            limits,
            block.timestamp
        );
        vm.stopPrank();
        assertEq(outToken.length, 1);
        assertEq(outToken[0].tokenAddress, address(usdcEth));
        assertEq(usdcEth.balanceOf(user), 0);
        assertEq(usdcEth.balanceOf(BridgeFacet(interchainMessageGateway).getLiquidityProjector()), amount);
        assertEq(bpt.balanceOf(user), 0);
    }

    //------EVENTS------//
    event BridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );

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
}
