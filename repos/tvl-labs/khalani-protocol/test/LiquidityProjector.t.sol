pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
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

        //lock and burn access test - Unknown Caller Invalid
        vm.startPrank(randomUser);
        vm.expectRevert(InvalidTokenMinterBurnerRole.selector);
        projector.lockOrBurn(1, randomUser, tokens);
        vm.stopPrank();

        vm.startPrank(randomUser);
        vm.expectRevert(InvalidTokenMinterBurnerRole.selector);
        projector.mintOrUnlock(1, randomUser, tokens);
        vm.stopPrank();
    }

    function test_RoleBasedAccess() public {
        projector = new LiquidityProjector(nexus, address(kaiKhalani));

        // add Token minter burner role test - default Admin role
        address randomUser = vm.addr(4);

        vm.startPrank(randomUser);
        vm.expectRevert(InvalidAdminRole.selector);
        projector.addTokenMinterBurnerRole(randomUser);
        vm.stopPrank();

        // let give role to any account let's say reactor contract
        address reactorContract = vm.addr(5);
        projector.addTokenMinterBurnerRole(reactorContract);

        bytes32 TOKEN_MINTERBURNER_ROLE = keccak256("TOKEN_MINTERBURNER_ROLE");
        assertTrue(projector.hasRole(TOKEN_MINTERBURNER_ROLE, reactorContract));
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

    function test_lockOrBurn_MultipleCaller() public {
        address user = vm.addr(4);
        projector = deployAndSetupLiquidityProjector();

        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kaiKhalani), 100);
        tokens[1] = Token(address(usdcEth), 100);

        //lets say user had 100 kaiKhalani and usdcEth tokens in their wallet
        IERC20MintableBurnable(address(kaiKhalani)).mint(address(user), 100);
        IERC20MintableBurnable(address(usdcEth)).mint(address(user), 100);

        //user wants to send these tokens to Ethereum from Khalani Chain
        vm.startPrank(user);
        IERC20(address(kaiKhalani)).approve(address(projector), 100);
        IERC20(address(usdcEth)).approve(address(projector), 100);
        vm.stopPrank();

        vm.prank(nexus); // caller nexus
        vm.expectEmit(address (projector));
        emit LockOrBurn(user, tokens); // user sends tokens to projector
        Token[] memory outputTokens = projector.lockOrBurn(1, user, tokens);
        assertEq(outputTokens[0].tokenAddress,address(kai));
        assertEq(outputTokens[1].tokenAddress,address(usdc));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(projector)), 100); // 100 Kai locked
        assertEq(IERC20(address(usdcEth)).totalSupply(), 0); // USDCEth is burned

        address invalidCaller = vm.addr(5);

        vm.startPrank(invalidCaller); // caller without the role
        vm.expectRevert(InvalidTokenMinterBurnerRole.selector);
        outputTokens = projector.lockOrBurn(1, invalidCaller, tokens);
        vm.stopPrank();

        address validCaller = vm.addr(6); 
        projector.addTokenMinterBurnerRole(validCaller);

        // validCaller has 100 kaiKhalani in wallet
        IERC20MintableBurnable(address(kaiKhalani)).mint(validCaller, 100);

        tokens = new Token[](1);
        tokens[0] = Token(address(kaiKhalani), 100);

        vm.startPrank(validCaller);
        IERC20(address(kaiKhalani)).approve(address(projector), 100);
        vm.stopPrank();

        assertEq(IERC20(address(kaiKhalani)).balanceOf(validCaller), 100); 

        vm.startPrank(validCaller); // caller with the role
        vm.expectEmit(address(projector));
        emit LockOrBurn(validCaller, tokens);
        outputTokens = projector.lockOrBurn(1, validCaller, tokens);
        vm.stopPrank();

        assertEq(outputTokens[0].tokenAddress,address(kai));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(projector)), 200); // 100 more Kai locked
        assertEq(IERC20(address(usdcEth)).balanceOf(validCaller), 0); // usdcEth burned
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

    function test_mintOrUnlock_MultipleCaller() public {
        address user = vm.addr(4);
        projector = deployAndSetupLiquidityProjector();
        IERC20MintableBurnable(address (kaiKhalani)).mint(address(projector), 200);

        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(user)), 0);
        assertEq(IERC20(address(kaiKhalani)).totalSupply(), 200);
        assertEq(IERC20(address(usdcEth)).balanceOf(user), 0);
        assertEq(IERC20(address(usdcEth)).totalSupply(), 0);
        
        vm.prank(nexus);
        vm.expectEmit(address (projector));
        emit MintOrUnlock(1, user, tokens);
        Token[] memory outputTokens = projector.mintOrUnlock(1, user, tokens);

        assertEq(outputTokens[0].tokenAddress,address(kaiKhalani));
        assertEq(outputTokens[1].tokenAddress,address(usdcEth));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(user)), 100); // Kai is unlocked and sent to user
        assertEq(IERC20(address(kaiKhalani)).totalSupply(), 200); // Kai supply remains same
        assertEq(IERC20(address(usdcEth)).balanceOf(user), 100); // USDCEth is unlocked

        address invalidCaller = vm.addr(5);

        vm.startPrank(invalidCaller); // caller without the role
        vm.expectRevert(InvalidTokenMinterBurnerRole.selector);
        outputTokens = projector.mintOrUnlock(1, invalidCaller, tokens);
        vm.stopPrank();

        address validCaller = vm.addr(6); 
        projector.addTokenMinterBurnerRole(validCaller);

        vm.startPrank(validCaller); // caller with the role
        vm.expectEmit(address(projector));
        emit MintOrUnlock(1, validCaller, tokens);
        outputTokens = projector.mintOrUnlock(1, validCaller, tokens);
        vm.stopPrank();

        assertEq(outputTokens[0].tokenAddress,address(kaiKhalani));
        assertEq(outputTokens[1].tokenAddress,address(usdcEth));
        assertEq(IERC20(address(kaiKhalani)).balanceOf(address(validCaller)), 100); // Kai is unlocked and sent to validCaller
        assertEq(IERC20(address(kaiKhalani)).totalSupply(), 200); // Kai supply increased 
        assertEq(IERC20(address(usdcEth)).balanceOf(validCaller), 100); // USDCEth is unlocked to validCaller

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