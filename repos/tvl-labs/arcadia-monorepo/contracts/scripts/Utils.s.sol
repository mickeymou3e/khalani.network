// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {ISignatureTransfer} from "permit2/src/interfaces/ISignatureTransfer.sol";
import {PermitSignature} from "permit2/test/utils/PermitSignature.sol";
import {Permit2} from "permit2/src/Permit2.sol";

interface IAssetReserves {
    function deposit(
        address token,
        uint256 amount,
        uint32 destChain,
        uint256 permitNonce,
        uint256 deadline,
        bytes calldata signature
    ) external payable;
}

contract Utils is Script, PermitSignature {
    function run() external {}

    function depositToAssetReserves() public {
        address spokeAssetReserves = vm.envAddress("ASSET_RESERVES_ADDRESS");
        address spokeTokenToDeposit = vm.envAddress("SPOKE_TOKEN_ADDRESS");
        address permit2Address = vm.envAddress("PERMIT2");
        uint256 depositorKey = vm.envUint("DEPOSITOR_KEY");

        vm.startBroadcast(depositorKey);
        ISignatureTransfer.PermitTransferFrom memory permit = defaultERC20PermitTransfer(spokeTokenToDeposit, 0);
        vm.stopBroadcast();
    }
}
