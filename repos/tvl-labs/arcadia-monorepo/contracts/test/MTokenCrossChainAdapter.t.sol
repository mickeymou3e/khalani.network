// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {XChainEvent, AssetReserveDeposit, MTokenWithdrawal} from "../src/types/Events.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {IMTokenManager} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {IEventPublisher} from "../src/event_system/interfaces/IEventPublisher.sol";
import {IEventHandler} from "../src/event_system/interfaces/IEventHandler.sol";
import {ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../src/types/Events.sol";
import {IEventProcessor} from "../src/event_system/interfaces/IEventProcessor.sol";
import {AccessManager} from "@oz5/contracts/access/manager/AccessManager.sol";

contract MTokenManagerMock is IMTokenManager {
    event Minted(address indexed to, address indexed mToken, uint256 amount);

    function mintMToken(address to, address mToken, uint256 amount) external override {
        emit Minted(to, mToken, amount);
    }
}

contract EventPublisherMock is IEventPublisher {
    event Published(bytes eventData, bytes32 eventType, uint32 destChain);

    uint256 public nonce;

    function publishEvent(bytes memory eventData, bytes32 eventType, uint32 destChain)
        external
        payable
        override
        returns (bytes32)
    {
        emit Published(eventData, eventType, destChain);
        nonce++;
        XChainEvent memory ev = XChainEvent(address(this), destChain, eventType, eventData, nonce);
        return keccak256(abi.encode(ev));
    }
}

contract EventHandlerMock is IEventHandler {
    uint256 public nonce;
    mapping(bytes32 => bool) public handledEvents;
    mapping(bytes32 evType => address evHandler) public eventProcessors;

    function addEventProcessor(bytes32 eventType, address _eventProcessor) external {
        eventProcessors[eventType] = _eventProcessor;
    }

    function handleEvent(XChainEvent calldata ev, uint32 originChain) external {
        nonce++;
        bytes32 evType = ev.eventHash;
        address processor = eventProcessors[evType];
        if (processor == address(0)) {
            revert("EventHandlerMock: processor not found");
        }
        IEventProcessor(processor).processEvent(ev, originChain);
        bytes32 evhash = keccak256(abi.encode(ev));
        handledEvents[evhash] = true;
    }
}

contract MTokenRegistryMock is MTokenRegistry {
    mapping(uint32 => mapping(address => address)) public stubMapping;

    constructor(address _mTokenManager, address _accessManager) MTokenRegistry(_mTokenManager, _accessManager) {}

    function setMapping(uint32 chainId, address spokeToken, address mToken) external {
        stubMapping[chainId][spokeToken] = mToken;
    }

    function getMTokenForSpokeToken(uint32 chainId, address spokeToken) external view override returns (address) {
        return stubMapping[chainId][spokeToken];
    }
}

contract MTokenCrossChainAdapterTest is Test {
    MTokenCrossChainAdapter public adapter;
    MTokenManagerMock public mTokenManager;
    EventPublisherMock public eventPublisher;
    MTokenRegistryMock public mTokenRegistry;
    EventHandlerMock public eventHandler;
    AccessManager public accessManager;
    bytes32 public depositEventType;
    address public admin = address(0xA11CE);
    address public user = address(0xBEEF);
    address public spokeToken = address(0x1001);
    address public mToken = address(0x2002);
    uint32 public chainId = 1;
    uint256 public amount = 1000 ether;
    bytes32 public withdrawEventType;

    function setUp() public {
        vm.startPrank(admin);
        accessManager = new AccessManager(admin);
        vm.stopPrank();
        mTokenManager = new MTokenManagerMock();
        eventPublisher = new EventPublisherMock();
        mTokenRegistry = new MTokenRegistryMock(address(mTokenManager), address(accessManager));

        eventHandler = new EventHandlerMock();
        vm.prank(admin);
        mTokenRegistry.setMapping(chainId, spokeToken, mToken);

        adapter = new MTokenCrossChainAdapter(
            address(mTokenManager), address(eventPublisher), address(mTokenRegistry), address(eventHandler)
        );

        withdrawEventType = adapter.getWithdrawEventType();
        depositEventType = keccak256(abi.encode(address(this), ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH));

        eventHandler.addEventProcessor(depositEventType, address(adapter));
    }

    function testProcessEvent() public {
        AssetReserveDeposit memory deposit = AssetReserveDeposit({token: spokeToken, amount: amount, depositor: user});
        bytes memory encodedData = abi.encode(deposit);
        XChainEvent memory xEvent = XChainEvent({
            publisher: address(0),
            originChainId: chainId,
            eventHash: depositEventType,
            eventData: encodedData,
            eventNonce: uint256(1)
        });

        vm.expectEmit(true, true, true, false);
        emit MTokenManagerMock.Minted(user, mToken, amount);
        eventHandler.handleEvent(xEvent, chainId);
    }

    function testWithdraw() public {
        MTokenWithdrawal memory withdrawal = MTokenWithdrawal({token: spokeToken, amount: amount, withdrawer: user});
        bytes memory expectedData = abi.encode(withdrawal, uint256(0));

        vm.expectEmit(true, true, true, false);
        emit EventPublisherMock.Published(expectedData, withdrawEventType, chainId);

        vm.prank(address(mTokenManager));
        adapter.withdraw(spokeToken, chainId, user, amount);

        assertEq(adapter.nonce(), 1, "Nonce should increment");
    }

    function testUnauthorizedWithdraw() public {
        vm.expectRevert(MTokenCrossChainAdapter.MTokenMinter__OnlyIMTokenManagerCanCall.selector);
        adapter.withdraw(spokeToken, chainId, user, amount);
    }
}
