import {IApplicationEventProcessor} from "../interfaces/IApplicationEventProcessor.sol";
import {WITHDRAWAL_EVENT, XChainAppEvent} from "../types/Events.sol";

// AssetReserves will inherit from this
contract AIPSpokeChainBridgeEventProcessor is IApplicationEventProcessor {
    address private s_eventHandler;
    address private s_eventPublisher;

    function processEvent(XChainAppEvent calldata _event) external {}
}
