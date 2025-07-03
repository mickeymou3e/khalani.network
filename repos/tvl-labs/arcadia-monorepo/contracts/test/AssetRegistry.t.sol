// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/event_system/apps/bridge/AssetRegistry.sol";
import {CustomERC20} from "../src/spoke/CustomERC20.sol";

contract MockAssetRegistry is AssetRegistry {
    constructor(address admin) AssetRegistry(admin) {}
}

contract AssetRegistryTest is Test {
    MockAssetRegistry public assetRegistry;
    address public admin;
    address public user;
    CustomERC20 public token1;
    CustomERC20 public token2;

    event AssetAdded(address indexed token, uint8 decimals);
    event AssetRemoved(address indexed token);

    function setUp() public {
        admin = makeAddr("admin");
        user = makeAddr("user");

        // Deploy MockAssetRegistry
        vm.prank(admin);
        assetRegistry = new MockAssetRegistry(admin);

        // Deploy Mock Tokens
        token1 = new CustomERC20("Token1", "TK1");
        token2 = new CustomERC20("Token2", "TK2");
    }

    function testAddAsset() public {
        vm.startPrank(admin);

        // Expect the AssetAdded event
        vm.expectEmit(true, true, false, true);
        emit AssetAdded(address(token1), 18);

        assetRegistry.addAsset(address(token1));

        // Ensure asset is registered
        assertTrue(assetRegistry.isSupportedAsset(address(token1)), "Token should be added");
        assertEq(assetRegistry.tokenDecimals(address(token1)), 18, "Token decimals should match");

        vm.stopPrank();
    }

    function testCannotAddAssetTwice() public {
        vm.startPrank(admin);
        assetRegistry.addAsset(address(token1));

        // Expect revert when adding the same asset again
        vm.expectRevert(AssetRegistry.AssetRegistry__AssetAlreadyAdded.selector);
        assetRegistry.addAsset(address(token1));

        vm.stopPrank();
    }

    function testCannotAddInvalidAsset() public {
        vm.startPrank(admin);

        // Expect revert when adding address(0)
        vm.expectRevert(AssetRegistry.AssetRegistry__InvalidAssetId.selector);
        assetRegistry.addAsset(address(0));

        vm.stopPrank();
    }

    function testRemoveAsset() public {
        vm.startPrank(admin);
        assetRegistry.addAsset(address(token1));

        // Expect the AssetRemoved event
        vm.expectEmit(true, false, false, false);
        emit AssetRemoved(address(token1));

        assetRegistry.removeAsset(address(token1));

        // Ensure asset is no longer supported
        assertFalse(assetRegistry.isSupportedAsset(address(token1)), "Token should be removed");
        vm.stopPrank();
    }

    function testCannotRemoveNonWhitelistedAsset() public {
        vm.startPrank(admin);

        // Expect revert when removing an asset that was never added
        vm.expectRevert(AssetRegistry.AssetRegistry__AssetNotWhitelisted.selector);
        assetRegistry.removeAsset(address(token1));

        vm.stopPrank();
    }

    function testCannotRemoveInvalidAsset() public {
        vm.startPrank(admin);

        // Expect revert when removing address(0)
        vm.expectRevert(AssetRegistry.AssetRegistry__InvalidAssetId.selector);
        assetRegistry.removeAsset(address(0));

        vm.stopPrank();
    }

    function testNonOwnerCannotAddAsset() public {
        vm.startPrank(user);

        // Expect revert when non-owner tries to add an asset
        vm.expectRevert("Ownable: caller is not the owner");
        assetRegistry.addAsset(address(token1));

        vm.stopPrank();
    }

    function testNonOwnerCannotRemoveAsset() public {
        vm.startPrank(admin);
        assetRegistry.addAsset(address(token1));
        vm.stopPrank();

        vm.startPrank(user);

        // Expect revert when non-owner tries to remove an asset
        vm.expectRevert("Ownable: caller is not the owner");
        assetRegistry.removeAsset(address(token1));

        vm.stopPrank();
    }

    function testCheckIfAssetIsSupported() public {
        vm.startPrank(admin);
        assetRegistry.addAsset(address(token1));
        vm.stopPrank();

        assertTrue(assetRegistry.isSupportedAsset(address(token1)), "Token1 should be supported");
        assertFalse(assetRegistry.isSupportedAsset(address(token2)), "Token2 should not be supported");
    }
}
