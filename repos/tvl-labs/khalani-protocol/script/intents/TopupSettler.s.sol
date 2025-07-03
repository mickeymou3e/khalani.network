pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../../src/Tokens/ERC20MintableBurnable.sol";

contract TopupSettler is Script {
    function run() public {
        string memory json = vm.readFile("./script/config/mirror_tokens.json");

        address[] memory sepoliaMirrorTokens = vm.parseJsonAddressArray(json, ".sepolia.mirrorTokens");
        address[] memory fujiMirrorTokens = vm.parseJsonAddressArray(json, ".fuji.mirrorTokens");
        uint256 amount = 10000 * (10 ** 6);
        address settlerAddress = address(0x36c384149036D795881774500325D67C3061124d);

        vm.createSelectFork("https://testnet.khalani.network/");
        vm.startBroadcast();

        for(uint i; i < sepoliaMirrorTokens.length;) {
            address tokenAddress = sepoliaMirrorTokens[i];
            ERC20MintableBurnable token = ERC20MintableBurnable(tokenAddress);
            token.mint(settlerAddress, amount);
            console.log("%s tokens minted on Khalani", amount);
            unchecked {
                ++i;
            }
        }

        for(uint i; i < fujiMirrorTokens.length;) {
            address tokenAddress = fujiMirrorTokens[i];
            ERC20MintableBurnable token = ERC20MintableBurnable(tokenAddress);
            token.mint(settlerAddress, amount);
            console.log("%s tokens minted on Khalani", amount);
            unchecked {
                ++i;
            }
        }

        vm.stopBroadcast();
    }
}