pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/LiquidityReserves/remote/AssetReserves.sol";
import "../src/LiquidityReserves/remote/IAssetReserves.sol";

contract AssetReservesTest is Test{
    address nexus;
    IERC20 kai;
    IERC20 usdc;
    IERC20 usdt; //won't whitelist
    address usdcMirror;
    address kaiKhalani;
    AssetReserves assetReserves;

    function setUp() public {
        nexus = vm.addr(1);
        kai = IERC20(new ERC20MintableBurnable("KAI", "KAI"));
        kaiKhalani = vm.addr(2);
        usdc = IERC20(new ERC20MintableBurnable("USDC", "USDC"));
        usdcMirror = vm.addr(3);
        usdt = IERC20(new ERC20MintableBurnable("USDT", "USDT"));
    }

    function test_AssetReserves_Access() public {
        assetReserves = new AssetReserves(nexus, address(kai));

        //setter access test - onlyOwner
        address randomUser = vm.addr(4);

        vm.startPrank(randomUser);
        vm.expectRevert(NotValidOwner.selector);
        assetReserves.addWhiteListedAsset(address(usdc));

        vm.expectRevert(NotValidOwner.selector);
        assetReserves.removeWhiteListedAsset(address(usdc));

        vm.stopPrank();

        //lock and burn access test - onlyNexus
        address unknownNexus = vm.addr(5);
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        vm.startPrank(unknownNexus);
        vm.expectRevert(InvalidNexus.selector);
        assetReserves.lockOrBurn(randomUser, tokens);

        vm.expectRevert(InvalidNexus.selector);
        assetReserves.mintOrUnlock(randomUser, tokens);
        vm.stopPrank();
    }

    function test_lockOrBurn() public {
        deployAndSetupAssetReserves();
        // create a user with 100 kai and 100 usdc
        address user = vm.addr(4);
        IERC20MintableBurnable(address(kai)).mint(user, 100);
        IERC20MintableBurnable(address(usdc)).mint(user, 100);

        //mintOrUnlock test
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        vm.startPrank(user);
        kai.approve(address(assetReserves), 100);
        usdc.approve(address(assetReserves), 100);
        vm.stopPrank();

        vm.startPrank(nexus);
        vm.expectEmit(true,true,true,true,address(assetReserves));
        emit LockOrBurn(user, tokens);
        assetReserves.lockOrBurn(user, tokens);
        vm.stopPrank();

        assertEq(kai.balanceOf(address (assetReserves)), 0);
        assertEq(kai.totalSupply(), 0);
        assertEq(usdc.balanceOf(address (assetReserves)), 100);
    }

    function test_lockOrBurn_InvalidAsset() public {
        deployAndSetupAssetReserves();
        // create a user with 100 kai and 100 usdc
        address user = vm.addr(4);
        IERC20MintableBurnable(address(kai)).mint(user, 100);
        IERC20MintableBurnable(address(usdc)).mint(user, 100);
        IERC20MintableBurnable(address(usdt)).mint(user, 100); //not whitelisted

        //mintOrUnlock test
        Token[] memory tokens = new Token[](3);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);
        tokens[2] = Token(address(usdt), 100); //added invalid asset to the list

        vm.startPrank(user);
        kai.approve(address(assetReserves), 100);
        usdc.approve(address(assetReserves), 100);
        usdt.approve(address(assetReserves), 100); //approved to assetReserves
        vm.stopPrank();

        vm.startPrank(nexus);
        vm.expectRevert(abi.encodeWithSelector(AssetNotWhiteListed.selector, address(usdt)));
        assetReserves.lockOrBurn(user, tokens);
        vm.stopPrank();

        assertEq(kai.balanceOf(address (assetReserves)), 0);
        assertEq(kai.totalSupply(), 100);
        assertEq(usdc.balanceOf(user), 100);
        assertEq(usdc.balanceOf(address (assetReserves)), 0);
        assertEq(usdt.balanceOf(user), 100);
    }

    function test_mintOrUnlock() public {
        deployAndSetupAssetReserves();
        // create a user with 100 kai and 100 usdc
        address user = vm.addr(4);
        IERC20MintableBurnable(address(kai)).mint(user, 100);
        IERC20MintableBurnable(address(usdc)).mint(user, 100);

        //mintOrUnlock test
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        vm.startPrank(user);
        kai.approve(address(assetReserves), 100);
        usdc.approve(address(assetReserves), 100);
        vm.stopPrank();

        // first token is locked
        vm.startPrank(nexus);
        assetReserves.lockOrBurn(user, tokens);
        vm.stopPrank();

        assertEq(kai.balanceOf(address (assetReserves)), 0);
        assertEq(kai.totalSupply(), 0);
        assertEq(usdc.balanceOf(address (assetReserves)), 100);

        //now we unlock the tokens
        Token[] memory mirrorTokens = new Token[](2);
        mirrorTokens[0] = Token(address(kai), 100);
        mirrorTokens[1] = Token(address(usdc), 100);

        vm.startPrank(nexus);
        vm.expectRevert("ERC20MintableBurnable: must have minter role to mint");
        assetReserves.mintOrUnlock(user, mirrorTokens);
        vm.stopPrank();

        ERC20MintableBurnable(address(kai)).addMinterRole(address(assetReserves));
        vm.startPrank(nexus);
        vm.expectEmit(true,true,true,true,address(assetReserves));
        emit MintOrUnlock(user, mirrorTokens);
        assetReserves.mintOrUnlock(user, mirrorTokens);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address (assetReserves)), 0);
        assertEq(kai.totalSupply(), 100);
        assertEq(kai.balanceOf(user), 100);
        assertEq(usdc.balanceOf(user), 100);
    }

    function test_mintOrUnlock_InvalidAsset() public {
        deployAndSetupAssetReserves();
        // create a user with 100 kai and 100 usdc
        address user = vm.addr(4);
        IERC20MintableBurnable(address(kai)).mint(user, 100);
        IERC20MintableBurnable(address(usdc)).mint(user, 100);

        //mintOrUnlock test
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(address(kai), 100);
        tokens[1] = Token(address(usdc), 100);

        vm.startPrank(user);
        kai.approve(address(assetReserves), 100);
        usdc.approve(address(assetReserves), 100);
        vm.stopPrank();

        // first token is locked
        vm.startPrank(nexus);
        assetReserves.lockOrBurn(user, tokens);
        vm.stopPrank();

        assertEq(kai.balanceOf(address (assetReserves)), 0);
        assertEq(kai.totalSupply(), 0);
        assertEq(usdc.balanceOf(address (assetReserves)), 100);

        //now we unlock the tokens
        Token[] memory mirrorTokens = new Token[](3);
        mirrorTokens[0] = Token(address(kai), 100);
        mirrorTokens[1] = Token(address(usdc), 100);
        mirrorTokens[2] = Token(address(usdt), 100); //added invalid asset to the list
        ERC20MintableBurnable(address(kai)).addMinterRole(address(assetReserves));
        vm.startPrank(nexus);
        vm.expectRevert(abi.encodeWithSelector(AssetNotFound.selector, usdt));
        assetReserves.mintOrUnlock(user, mirrorTokens);
        vm.stopPrank();
    }

    function deployAndSetupAssetReserves() private {
        assetReserves = new AssetReserves(nexus, address(kai));

        vm.expectEmit(address(assetReserves));
        emit AssetAddedToWhitelist(address(usdc));
        assetReserves.addWhiteListedAsset(address(usdc));
    }


    event LockOrBurn(
        address indexed sender,
        Token[] tokens
    );
    event MintOrUnlock(
        address indexed target,
        Token[] mirrorTokens
    );

    event AssetAddedToWhitelist(
        address indexed asset
    );
    event AssetRemovedFromWhitelist(
        address indexed asset
    );
    event MirrorTokenSet(
        address indexed token,
        address indexed mirrorToken
    );
}
