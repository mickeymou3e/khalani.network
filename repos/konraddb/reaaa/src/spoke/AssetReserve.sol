import {IApplicationEventProcessor} from "../interfaces/IApplicationEventProcessor.sol";
import {IApplicationEventProducer} from "../interfaces/IApplicationEventProducer.sol";
import {WITHDRAWAL_EVENT, XChainAppEvent} from "../types/Events.sol";

// AssetReserves will inherit from this
abstract contract AssetReserve is IApplicationEventProcessor, IApplicationEventProducer {
    error AssetReserve__OnlyEventHandler();
    error AssetReserve__InvalidAppId(bytes32 eventAppId);

    address private s_eventHandler;
    address private s_eventPublisher;

    modifier onlyEventHandler() {
        if (msg.sender != s_eventHandler) {
            revert AssetReserve__OnlyEventHandler();
        }
        _;
    }

    function processEvent(XChainAppEvent calldata _event) external onlyEventHandler {}

    function produceAppEvent(XChainAppEvent calldata _event) external {}

    function validateAppId(XChainAppEvent calldata _event) internal {}
}
