// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// // Test and utility imports
// import "forge-std/Test.sol";
// import {Utilities} from "./Utilities.sol";
// import {GasPriceOracle} from "../src/common/GasPriceOracle.sol";
// import {InterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/hooks/igp/InterchainGasPaymaster.sol";
// import {SignatureLib} from "../src/libraries/SignatureLib.sol";
// import {SolutionLib} from "../src/libraries/SolutionLib.sol";

// // Type imports
// import "../src/types/Intent.sol";
// import "../src/types/Events.sol";
// import {Receipt as ReceiptStruct} from "../src/types/Receipt.sol";

// // Hub chain imports
// import {MTokenManager} from "../src/hub/MTokenManager.sol";
// import "../src/hub/MToken.sol";
// import "../src/hub/ReceiptManager.sol";
// import "../src/hub/IntentBook.sol";

// // Event system interfacesimports
// import "../src/event_system/interfaces/IEventProver.sol";
// import "../src/event_system/interfaces/IEventVerifier.sol";
// import "../src/event_system/interfaces/IEventProcessor.sol";
// import "../src/event_system/interfaces/IEventPublisher.sol";
// import "../src/event_system/interfaces/IEventHandler.sol";
// import "../src/event_system/interfaces/IEventProducer.sol";

// // Event system imports
// import {EventProver} from "../src/event_system/EventProver.sol";
// import {EventVerifier} from "../src/event_system/EventVerifier.sol";
// import {HubHandler} from "../src/event_system/HubHandler.sol";
// import {SpokeHandler} from "../src/event_system/SpokeHandler.sol";
// import {HubPublisher} from "../src/event_system/HubPublisher.sol";
// import {SpokePublisher} from "../src/event_system/SpokePublisher.sol";

// // Event system bridge app imports
// import "../src/event_system/apps/bridge/AssetRegistry.sol";
// import "../src/event_system/apps/bridge/AssetReserves.sol";
// import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";

// contract MockERC20 is ERC20 {
//     uint8 private _decimals;

//     constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
//         _decimals = decimals_;
//     }

//     function mint(address account, uint256 amount) external {
//         _mint(account, amount);
//     }

//     function decimals() public view override returns (uint8) {
//         return _decimals;
//     }
// }

// contract SystemStateV2 is Utilities {
//     // Token States
//     MockERC20 spokeToken1;
//     MockERC20 spokeToken2;
//     MockERC20 spokeToken3;
//     MToken mToken1;
//     MToken mToken2;
//     MToken mToken3;

//     // Hub States
//     IntentBook intentBook;
//     MTokenManager mTokenMgr;
//     ReceiptManager receiptManager;

//     // Event system states
//     HubHandler hubHandler;
//     HubPublisher hubPublisher;
//     SpokeHandler spokeHandler;
//     SpokePublisher spokePublisher;
//     AssetReserves assetReserves;
//     AssetRegistry assetRegistry;
//     EventProver eventProver;
//     EventVerifier eventVerifier;
//     GasPriceOracle gasPriceOracle;
//     InterchainGasPaymaster igp;

//     // Simulation states
//     address owner = address(0x1);
//     address user1 = address(0x2);
//     address user2 = address(0x3);

//     uint256 key1;
//     uint256 key2;
//     address public addr1;
//     address public addr2;

//     function setUp() public override {
//         super.setUp();
//         vm.startPrank(owner);
//         interchainGasPaymaster = new InterchainGasPaymaster();
//         gasPriceOracle = new gasPr
//     }
// }
