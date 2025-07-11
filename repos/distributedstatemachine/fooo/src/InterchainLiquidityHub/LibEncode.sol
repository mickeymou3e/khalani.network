pragma solidity ^0.8.0;

import "./BalancerTypes.sol";

library LibEncode {
    function encodePack(
        BatchSwapStep[] memory swaps
    ) internal pure returns (bytes memory encodedSwaps, uint256 swapCount) {
        for (uint i; i < swaps.length; ) {
            encodedSwaps = abi.encodePacked(
                encodedSwaps,
                keccak256(abi.encodePacked(bytes32(swaps[i].amount))),
                uint256(swaps[i].assetInIndex),
                uint256(swaps[i].assetOutIndex),
                uint256(swaps[i].amount)
            );
            swapCount++;
            unchecked {
                ++i;
            }
        }
    }

    function decodePacked(
        bytes memory encodedData,
        uint arrayLength
    ) internal pure returns (BatchSwapStep[] memory) {
        BatchSwapStep[] memory steps = new BatchSwapStep[](arrayLength);
        uint256 stepSize = 32 * 4; // total size of each BatchSwapStep structure

        for (uint256 i; i < arrayLength; ) {
            bytes32 poolId;
            uint256 assetInIndex;
            uint256 assetOutIndex;
            uint256 amount;

            //big-endian
            assembly {
                poolId := mload(add(encodedData, add(32, mul(i, stepSize))))
                assetInIndex := mload(
                    add(encodedData, add(64, mul(i, stepSize)))
                )
                assetOutIndex := mload(
                    add(encodedData, add(96, mul(i, stepSize)))
                )
                amount := mload(add(encodedData, add(128, mul(i, stepSize))))
            }

            steps[i] = BatchSwapStep(
                poolId,
                assetInIndex,
                assetOutIndex,
                amount,
                ""
            );
            unchecked {
                ++i;
            }
        }
        return steps;
    }
}
