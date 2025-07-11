// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "src/IMinimalBalancerV2.sol";

contract BalancerPoolV2Mock is IMinimalBalancerPoolV2 {
    constructor() {}

    function getNormalizedWeights() external pure returns (uint256[] memory) {
        uint256[] memory weights = new uint256[](2);
        weights[0] = 500000000000000000;
        weights[1] = 500000000000000000;

        return weights;
    }
}
