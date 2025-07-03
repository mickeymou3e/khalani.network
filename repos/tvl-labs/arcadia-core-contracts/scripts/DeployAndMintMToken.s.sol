// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {IntentBook} from "../src/hub/IntentBook.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {EventProver} from "../src/common/EventProver.sol";
import {EventVerifier} from "../src/common/EventVerifier.sol";
import {MToken} from "../src/hub/MToken.sol";
import {AuthorizationManager} from "../src/modules/AuthorizationManager.sol";
import {console} from "forge-std/console.sol";

contract DeployAndMintMToken is Script {
    function run() external {
        uint256 mTokenOwner = vm.envUint("MTOKEN_ADMIN_KEY");
        address mTokenUser = vm.envAddress("MTOKEN_USER");
        address mTokenRegistry = vm.envAddress("MTOKEN_REGISTRY");
        address mTokenManager = vm.envAddress("MTOKEN_MANAGER");

        vm.startBroadcast(mTokenOwner);

        address mtok = MTokenRegistry(mTokenRegistry).createMToken("MockToken", "MTK", address(0), 31337);
        MTokenManager(mTokenManager).mintMToken(mTokenUser, mtok, 10000 * 10 ** 18);
        address mtok2 = MTokenRegistry(mTokenRegistry).createMToken("MockToken2", "MTK2", address(0), 31337);
        address mtok3 = MTokenRegistry(mTokenRegistry).createMToken("MockToken3", "MTK3", address(0), 31337);
        MTokenManager(mTokenManager).mintMToken(mTokenUser, mtok3, 10000 * 10 ** 18);
        address mtok4 = MTokenRegistry(mTokenRegistry).createMToken("MockToken4", "MTK4", address(0), 31337);
        MTokenManager(mTokenManager).mintMToken(mTokenUser, mtok2, 10000 * 10 ** 18);

        vm.stopBroadcast();
        console.log("MTokens deployed. Addresses: \n");
        console.log("MockToken: %s", mtok);
        console.log("MockToken2: %s", mtok2);
        console.log("MockToken3: %s", mtok3);
        console.log("MockToken4: %s", mtok4);

        console.log("Minted 10000 MockToken to %s", mTokenUser);
        console.log("Minted 10000 MockToken3 to %s", mTokenUser);
    }
}
