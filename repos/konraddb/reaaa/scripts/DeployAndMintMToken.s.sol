// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {console} from "forge-std/console.sol";

contract DeployMTokensMocked is Script {
    struct TokenDetails {
        string name;
        string symbol;
        address spokeTokenAddress;
        uint32 chainId;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("MTOKEN_ADMIN_KEY");
        address deployerAddress = vm.envAddress("MTOKEN_USER");
        address mTokenRegistryAddress = vm.envAddress("MTOKEN_REGISTRY");
        address mTokenManagerAddress = vm.envAddress("MTOKEN_MANAGER");

        if (mTokenRegistryAddress == address(0) || mTokenManagerAddress == address(0)) {
            console.log("MToken Registry address or MToken Manager address is missing.");
            revert();
        }

        vm.startBroadcast(deployerPrivateKey);

        MTokenRegistry mTokenRegistry = MTokenRegistry(mTokenRegistryAddress);

        TokenDetails[8] memory MTOKEN_DETAILS = [
            // Avalanche tokens
            TokenDetails({
                name: "MToken USDC",
                symbol: "MUSDC",
                spokeTokenAddress: 0x5065EbB5402075693d009cF275DcD93B0eA399b5,
                chainId: 43113
            }),
            TokenDetails({
                name: "MToken USDT",
                symbol: "MUSDT",
                spokeTokenAddress: 0x6E0E9A73450b385fc4d5A0EB27e288953f80E8bb,
                chainId: 43113
            }),
            TokenDetails({
                name: "MToken DAI",
                symbol: "MDAI",
                spokeTokenAddress: 0x5D6BAb06eb33b29e3DE603916c94d4C88fa8E479,
                chainId: 43113
            }),
            TokenDetails({
                name: "MToken WETH",
                symbol: "MWETH",
                spokeTokenAddress: 0x63456305fBE338426B8834BAAbA065cE6c514Ca4,
                chainId: 43113
            }),
            // Holesky tokens
            TokenDetails({
                name: "MToken USDC",
                symbol: "MUSDC",
                spokeTokenAddress: 0x1d9711841348357634Efb4eC0cF0094113ce0cA7,
                chainId: 17000 // Holesky Testnet Chain ID
            }),
            TokenDetails({
                name: "MToken USDT",
                symbol: "MUSDT",
                spokeTokenAddress: 0x09b799826Bd312BbA8451bab748b5f2596C1A70c,
                chainId: 17000
            }),
            TokenDetails({
                name: "MToken DAI",
                symbol: "MDAI",
                spokeTokenAddress: 0x6DCe89147fA6e6BDF83BfAD5180C759Fc6F97EB1,
                chainId: 17000
            }),
            TokenDetails({
                name: "MToken WETH",
                symbol: "MWETH",
                spokeTokenAddress: 0x5c55ecd76fB48FE38975E278BA8dBf93956Ad6A6,
                chainId: 17000
            })
        ];

        for (uint256 i = 0; i < MTOKEN_DETAILS.length; i++) {
            TokenDetails memory details = MTOKEN_DETAILS[i];

            if (details.spokeTokenAddress == address(0)) {
                console.log("Skipping %s as no valid spoke token address is provided.", details.symbol);
                continue;
            }

            console.log("Deploying MToken for %s (%s)...", details.symbol, details.name);

            address mTokenAddress = mTokenRegistry.createMToken(
                details.name,
                details.symbol,
                details.spokeTokenAddress,
                details.chainId
            );

            console.log("MToken %s deployed at address: %s", details.symbol, mTokenAddress);

            MTokenManager mTokenManager = MTokenManager(mTokenManagerAddress);
            mTokenManager.mintMToken(deployerAddress, mTokenAddress, 10000 * 10 ** 18);
        }

        vm.stopBroadcast();
        console.log("All MTokens deployed successfully.");
    }
}