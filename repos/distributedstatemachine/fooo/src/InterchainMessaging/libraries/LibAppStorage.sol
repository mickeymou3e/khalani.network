// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from "../../diamondCommons/libraries/LibDiamond.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../Errors.sol";

library Constants {
    /**
    * @notice Reentrancy modifier for diamond
    */
    uint256 internal constant NOT_ENTERED = 1;

    /**
    * @notice Reentrancy modifier for diamond
    */
    uint256 internal constant ENTERED = 2;
}

struct RemoteAppStorage {
    address hyperlaneAdapter;
    address assetReserves;
    address khalaniReceiver;
    uint256 khalaniChainId;
}

struct KhalaniAppStorage {
    address hyperlaneAdapter;
    address liquidityProjector;
    address interchainLiquidityHub;
    address liquidityAggregator;
    mapping(uint => address) chainIdToAdapter;
}

abstract contract Modifiers {

    uint256 _requestProcessorStatus;
    uint256 _bridgeStatus;

    modifier onlyDiamondOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyHyperlaneAdapter(address hyperlaneAdapter) {
        if(msg.sender != hyperlaneAdapter){
            revert InvalidHyperlaneAdapter();
        }
        _;
    }

    modifier nonReentrant() {

        // On the first call to nonReentrant, _notEntered will be true
        if (_requestProcessorStatus == Constants.ENTERED) revert BaseDiamondFacet__nonReentrant_reentrantCall();

        // Any calls to nonReentrant after this point will fail
        _requestProcessorStatus = Constants.ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _requestProcessorStatus = Constants.NOT_ENTERED;
    }

    modifier bridgeCallNonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        if (_bridgeStatus == Constants.ENTERED) revert BaseDiamondFacet__bridgeCallNonReentrant_reentrantCall();

        // Any calls to nonReentrant after this point will fail
        _bridgeStatus = Constants.ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _bridgeStatus = Constants.NOT_ENTERED;
    }
}

contract RemoteStorage is Modifiers {
    RemoteAppStorage internal s;
}

contract KhalaniStorage is Modifiers {
    KhalaniAppStorage internal s;
}
