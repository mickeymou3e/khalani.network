// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {stdJson} from "forge-std/StdJson.sol";

enum DeploymentInfoSource {
    Broadcast,
    Env
}

abstract contract BaseScript is Script {
    address payable internal eventPublisher;
    address internal eventHandler;
    address internal mailbox;
    address internal eventVerifier;
    address internal eventProver;
    address internal gasAmountOracle;
    address internal igp;

    address internal roleAdmin; // role admin on access manager
    address internal deployer; // the deployer of the contracts
    address internal manager; // access manager contract
    address internal contractsManager; // Equivalent to 'contractsManager' in tests
    address internal medusa;

    uint256 internal roleAdminKey;
    uint256 internal deployerKey;
    uint256 internal contractsManagerKey;

    uint256 internal chainId;

    function run() public virtual;

    function getMailbox() internal virtual returns (address);

    function preProcess() internal virtual;

    function loadBaseInformation() internal {
        deployer = vm.envAddress("DEPLOYER");

        roleAdmin = vm.envAddress("ROLE_ADMIN");
        contractsManager = vm.envAddress("CONTRACTS_MANAGER");

        roleAdminKey = vm.envUint("ROLE_ADMIN_KEY");
        deployerKey = vm.envUint("DEPLOYER_KEY");
        contractsManagerKey = vm.envUint("CONTRACTS_MANAGER_KEY");

        chainId = block.chainid;
    }

    function getContractAddressFromBroadcast(string memory contractName, string memory scriptName, uint256 chainId)
        internal
        view
        returns (address)
    {
        string memory root = vm.projectRoot();
        string memory path =
            string.concat(root, "/broadcast/", scriptName, "/", vm.toString(chainId), "/run-latest.json");
        string memory json = vm.readFile(path);

        uint256 index = 0;
        string memory key;
        bool found = false;
        while (index < 50) {
            key = string.concat(".transactions[", vm.toString(index), "].contractName");
            string memory name = stdJson.readString(json, key);

            if (keccak256(bytes(name)) == keccak256(bytes(contractName))) {
                found = true;
                break;
            }
            index++;
        }

        if (!found) {
            return address(0);
        }

        key = string.concat(".transactions[", vm.toString(index), "].contractAddress");
        bytes memory contractAddress = stdJson.parseRaw(json, key);
        return bytesToAddress(contractAddress);
    }

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 32))
        }
    }
}
