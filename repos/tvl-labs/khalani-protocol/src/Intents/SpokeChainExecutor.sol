// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./proof/EventProver.sol";
import "./libraries/SpokeChainCallEventLibrary.sol";

contract SpokeChainExecutor {
    event SpokeCalled(address indexed contractToCall, address indexed token, uint256 indexed amount);
    EventProver public spokeChainCallEventProver;

    constructor(EventProver _spokeChainCallEventProver) {
        spokeChainCallEventProver = _spokeChainCallEventProver;
    }

    function callSpoke(bytes32 spokeChainCallIntentId, address contractToCall, bytes calldata callData, address token, uint256 amount) external {
        if (token != address(0)) {
            SafeERC20.safeTransferFrom(
                IERC20(token),
                msg.sender,
                address(this),
                amount
            );
            SafeERC20.safeApprove(IERC20(token), contractToCall, amount);
        }

        // Execute the callSpoke function on the specified contract
        (bool success, ) = contractToCall.call(callData);
        require(success, "Call to contract failed");

        //calculate hash of the event
        bytes32 eventHash = SpokeChainCallEventLibrary.calculateSpokeCalledEventHash(
            SpokeChainCallEventLibrary.SpokeCalled(
                msg.sender,
                spokeChainCallIntentId,
                contractToCall,
                callData,
                token,
                amount
            )
        );
        //register event
        spokeChainCallEventProver.registerEvent(eventHash);
        emit SpokeCalled(contractToCall, token, amount);
    }
}
