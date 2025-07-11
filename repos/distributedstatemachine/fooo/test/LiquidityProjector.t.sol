pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/InterchainMessaging/Token.sol";
import "../src/LiquidityReserves/khalani/LiquidityProjector.sol";

contract LiquidityProjectorTest is Test {
    address nexus;
    IERC20 kaiKhalani;
    IERC20 usdcEth;
    IERC20 usdtEth;

    address kai;
    address usdc;
    address usdt;

    LiquidityProjector projector;
    function setUp() public {
        nexus = vm.addr(1);

        kai = vm.addr(2);
        usdc = vm.addr(3);
        usdt = vm.addr(4);

        kaiKhalani = IERC20(new ERC20MintableBurnable("KAI","KAI"));
        usdcEth = IERC20(new ERC20MintableBurnable("USDC.ETH","USDC/ETH"));
        usdtEth = IERC20(new ERC20MintableBurnable("USDT.ETH","USDT/ETH"));
    }

    function test_LiquidityProjector_Access() public {
        projector = new LiquidityProjector(nexus, address(kaiKhalani));
        address randomUser = vm.addr(4);

        //setter access test - onlyOwner
        vm.startPrank(randomUser);
        vm.expectRevert(NotValidOwner.selector);
        projector.setMirrorToken(1, usdc, address(usdcEth));
        vm.stopPrank();

        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        //lock and burn access test - onlyNexus
        vm.startPrank(randomUser);
        vm.expectRevert(InvalidNexus.selector);
        projector.lockOrBurn(1, randomUser, tokens);
        vm.stopPrank();

        vm.startPrank(randomUser);
        vm.expectRevert(InvalidNexus.selector);
        projector.mintOrUnlock(1, randomUser, tokens);
        vm.stopPrank();
    }

    function test_lockOrBurn() public {
        address user = vm.addr(4);
        projector = deployAndSetupLiquidityProjector();

        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kaiKhalani), 100);
        tokens[1] = Token(address(usdcEth), 100);

        //lets say user had these tokens in their wallet
        IERC20MintableBurnable(address(kaiKhalani)).mint(address(user), 100);
        IERC20MintableBurnable(address(usdcEth)).mint(address(user), 100);

        //user wants to send these tokens to Ethereum from Khalani Chain
        vm.startPrank(user);
        IERC20(address(kaiKhalani)).approve(address(projector), 100);
        IERC20(address(usdcEth)).approve(address(projector), 100);
        vm.stopPrank();

        vm.prank(nexus);
        vm.expectEmit(address (projector));
        emit LockOrBurn(user, tokens); // user sends tokens to projector
        tokens = projector.lockOrBurn(1, user, tokens);
        assertEq(tokens[0].tokenAddress,address(kai));
        assertEq(tokens[1].tokenAddress,address(usdc));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(projector)), 100); // Kai is locked
        assertEq(IERC20(address(usdcEth)).totalSupply(), 0); // USDCEth is burned
    }

    function test_mintOrUnlock() public {
        address user = vm.addr(4);
        projector = deployAndSetupLiquidityProjector();
        IERC20MintableBurnable(address (kaiKhalani)).mint(address(projector), 100);

        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(user)), 0);
        assertEq(IERC20(address(kaiKhalani)).totalSupply(), 100);
        assertEq(IERC20(address(usdcEth)).balanceOf(user), 0);
        assertEq(IERC20(address(usdcEth)).totalSupply(), 0);
        vm.prank(nexus);
        vm.expectEmit(address (projector));
        emit MintOrUnlock(1, user, tokens);
        tokens = projector.mintOrUnlock(1, user, tokens);

        assertEq(tokens[0].tokenAddress,address(kaiKhalani));
        assertEq(tokens[1].tokenAddress,address(usdcEth));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(user)), 100); // Kai is unlocked and sent to user
        assertEq(IERC20(address(kaiKhalani)).totalSupply(), 100); // Kai supply remains same
        assertEq(IERC20(address(usdcEth)).balanceOf(user), 100); // USDCEth is unlocked
    }

    function test_mintOrUnlock_InvalidAsset() public {
        address user = vm.addr(4);
        projector = deployAndSetupLiquidityProjector();
        IERC20MintableBurnable(address (kaiKhalani)).mint(address(projector), 100);

        Token[] memory tokens = new Token[](3);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);
        tokens[2] = Token(address(usdt), 100);

        vm.prank(nexus);
        vm.expectRevert(abi.encodeWithSelector(AssetNotFound.selector,address(usdt))); // should revert USDT
        projector.mintOrUnlock(1, user, tokens);
    }

    function deployAndSetupLiquidityProjector() private returns (LiquidityProjector) {
        projector = new LiquidityProjector(nexus, address(kaiKhalani));

        vm.expectEmit(address (projector));
        emit MirrorTokenSet(1, usdc, address (usdcEth));
        projector.setMirrorToken(1, usdc, address(usdcEth));

        vm.expectEmit(address (projector));
        emit MirrorTokenSet(1, kai, address(kaiKhalani));
        projector.setMirrorToken(1, kai, address(kaiKhalani));

        ERC20MintableBurnable(address(usdcEth)).addMinterRole(address(projector));
        return projector;
    }

    event LockOrBurn(
        address indexed sender,
        Token[] tokens
    );
    event MintOrUnlock(
        uint256 indexed chainId,
        address indexed target,
        Token[] tokens
    );

    event MirrorTokenSet(
        uint256 indexed chainId,
        address indexed token,
        address indexed mirrorToken
    );
}