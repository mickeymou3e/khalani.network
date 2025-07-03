// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// Removed direct import of MTokenRegistry and MToken as they are available via SystemState
import {MTokenInfo, SpokeTokenInfo} from "../src/types/MToken.sol";
import {SystemState} from "./SystemState.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";

contract MTokenRegistryTest is SystemState {
    uint32 public constant anotherChainId = 2;

    event MTokenCreated(
        address indexed mToken, string symbol, string name, address indexed spokeAddr, uint32 spokeChainId
    );
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    event MTokenPaused(address indexed mToken);
    event MTokenUnpaused(address indexed mToken);
    event MTokenDestroyed(address indexed mToken);

    function testCreateMToken() public {
        string memory symbol = "mETH_new";
        string memory name = "MToken ETH New";
        address spokeAddr = address(spokeToken); // from SystemState
        uint32 spokeChain = anotherChainId; // Use anotherChainId for a fresh token

        vm.startPrank(contractsManager); // Restricted functions are callable by contractsManager

        vm.expectEmit(false, false, false, false);
        emit OwnershipTransferred(address(0), address(mTokenRegistry));
        vm.expectEmit(false, false, false, false);
        emit OwnershipTransferred(address(mTokenRegistry), address(mTokenManager));
        // vm.expectEmit(false, false, false, true);
        // emit MTokenCreated(address(0), symbol, name, spokeAddr, spokeChain);

        address mTokenAddress = mTokenRegistry.createMToken(symbol, name, spokeAddr, spokeChain);
        vm.stopPrank();

        MTokenInfo memory info = mTokenRegistry.getMTokenInfo(mTokenAddress);
        assertEq(info.mTokenAddress, mTokenAddress, "MToken address should match");
        assertFalse(info.isPaused, "MToken should not be paused");
        assertFalse(info.isDestroyed, "MToken should not be destroyed");

        // Verify retrieval functions
        address fetchedMToken = mTokenRegistry.getMTokenForSpokeToken(spokeChain, spokeAddr);
        assertEq(fetchedMToken, mTokenAddress, "Fetched MToken should match via getMTokenForSpokeToken");

        SpokeTokenInfo memory spokeInfo = mTokenRegistry.getSpokeInfoForMToken(mTokenAddress);
        assertEq(spokeInfo.token, spokeAddr, "Spoke token address should match");
        assertEq(spokeInfo.chainId, spokeChain, "Spoke chain ID should match");
    }

    function testCannotCreateDuplicateMToken() public {
        vm.startPrank(contractsManager);
        // Use a spokeToken and a chainId that is not already used by SystemState's default mTokens
        // to ensure the first creation in this test succeed
        address testSpokeToken = address(spokeToken2);
        uint32 testChainId = anotherChainId;

        mTokenRegistry.createMToken("mUNIQUE", "MToken Unique", testSpokeToken, testChainId);

        vm.expectRevert(MTokenRegistry.MTokenRegistry__MTokenAlreadyExists.selector);

        mTokenRegistry.createMToken("mDUPLICATE", "MToken Duplicate", testSpokeToken, testChainId);
        vm.stopPrank();
    }

    function testPauseMToken() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest = mTokenRegistry.createMToken("mPAUSE", "MTokenToPause", address(spokeToken), anotherChainId);
        vm.stopPrank();

        vm.expectEmit(true, false, false, false);
        emit MTokenPaused(mTokenToTest);

        vm.startPrank(contractsManager);
        mTokenRegistry.pauseMToken(mTokenToTest);
        vm.stopPrank();

        MTokenInfo memory info = mTokenRegistry.getMTokenInfo(mTokenToTest);
        assertTrue(info.isPaused, "MToken should be paused");
    }

    function testUnpauseMToken() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest = mTokenRegistry.createMToken("mUNP", "MTokenToUnpause", address(spokeToken), anotherChainId);
        mTokenRegistry.pauseMToken(mTokenToTest);
        vm.stopPrank();

        vm.expectEmit(true, false, false, false);
        emit MTokenUnpaused(mTokenToTest);

        vm.startPrank(contractsManager);
        mTokenRegistry.unpauseMToken(mTokenToTest);
        vm.stopPrank();

        MTokenInfo memory info = mTokenRegistry.getMTokenInfo(mTokenToTest);
        assertFalse(info.isPaused, "MToken should be unpaused");
    }

    function testDestroyMToken() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest = mTokenRegistry.createMToken("mDEST", "MTokenToDestroy", address(spokeToken), anotherChainId);
        vm.stopPrank();

        vm.expectEmit(true, false, false, false);
        emit MTokenDestroyed(mTokenToTest);

        vm.startPrank(contractsManager);
        mTokenRegistry.destroyMToken(mTokenToTest);
        vm.stopPrank();

        MTokenInfo memory info = mTokenRegistry.getMTokenInfo(mTokenToTest);
        assertTrue(info.isDestroyed, "MToken should be destroyed");
    }

    function testCannotPauseNonExistentMToken() public {
        address fakeMToken = makeAddr("fakeMToken");
        vm.startPrank(contractsManager);
        vm.expectRevert(MTokenRegistry.MTokenRegistry__MTokenNotFound.selector);
        mTokenRegistry.pauseMToken(fakeMToken);
        vm.stopPrank();
    }

    function testCannotUnpauseDestroyedMToken() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest = mTokenRegistry.createMToken("mDSTUNP", "MTokenDstUnp", address(spokeToken), anotherChainId);
        mTokenRegistry.destroyMToken(mTokenToTest);

        vm.expectRevert(MTokenRegistry.MTokenRegistry__MTokenDestroyed.selector);
        mTokenRegistry.unpauseMToken(mTokenToTest);
        vm.stopPrank();
    }

    function testFetchMTokenForSpokeToken() public {
        address createdMToken;
        address spokeForThisTest = address(spokeToken2);
        uint32 chainForThisTest = anotherChainId;

        vm.startPrank(contractsManager);
        createdMToken = mTokenRegistry.createMToken("mFETCH", "MTokenFetch", spokeForThisTest, chainForThisTest);
        vm.stopPrank();

        address fetchedMToken = mTokenRegistry.getMTokenForSpokeToken(chainForThisTest, spokeForThisTest);
        assertEq(fetchedMToken, createdMToken, "Fetched MToken should match");
    }

    function testFetchSpokeInfoForMToken() public {
        address createdMToken;
        address spokeForThisTest = address(spokeToken2);
        uint32 chainForThisTest = anotherChainId;

        vm.startPrank(contractsManager);
        createdMToken = mTokenRegistry.createMToken("mSPOKEINFO", "MTokenSpokeInfo", spokeForThisTest, chainForThisTest);
        vm.stopPrank();

        SpokeTokenInfo memory info = mTokenRegistry.getSpokeInfoForMToken(createdMToken);
        assertEq(info.token, spokeForThisTest, "Spoke token should match");
        assertEq(info.chainId, chainForThisTest, "Spoke chain ID should match");
    }

    function testCheckValidMToken() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest = mTokenRegistry.createMToken("mVALID", "MTokenValid", address(spokeToken), anotherChainId);
        vm.stopPrank();

        mTokenRegistry.checkValidMToken(mTokenToTest); // Should not revert
    }

    function testCheckValidMTokenFailsIfPaused() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest =
            mTokenRegistry.createMToken("mPAUSEDCHK", "MTokenPausedCheck", address(spokeToken), anotherChainId);
        mTokenRegistry.pauseMToken(mTokenToTest); // Pause it
        vm.stopPrank();

        vm.expectRevert(MTokenRegistry.MTokenRegistry__MTokenPaused.selector);
        mTokenRegistry.checkValidMToken(mTokenToTest);
    }

    function testCheckValidMTokenFailsIfDestroyed() public {
        address mTokenToTest;
        vm.startPrank(contractsManager);
        mTokenToTest =
            mTokenRegistry.createMToken("mDESTCHK", "MTokenDestroyedCheck", address(spokeToken), anotherChainId);
        mTokenRegistry.destroyMToken(mTokenToTest); // Destroy it
        vm.stopPrank();

        vm.expectRevert(MTokenRegistry.MTokenRegistry__MTokenDestroyed.selector);
        mTokenRegistry.checkValidMToken(mTokenToTest);
    }

    function testCheckValidMTokenFailsIfNotExists() public {
        address fakeMToken = makeAddr("fakeMToken");
        vm.expectRevert(MTokenRegistry.MTokenRegistry__UnsupportedMToken.selector);
        mTokenRegistry.checkValidMToken(fakeMToken);
    }
}
