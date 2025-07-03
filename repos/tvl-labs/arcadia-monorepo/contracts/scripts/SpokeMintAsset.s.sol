// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Script.sol";

interface IUSDC {
    function masterMinter() external view returns (address);
    function configureMinter(address minter, uint256 allowance) external returns (bool);
    function mint(address to, uint256 amount) external returns (bool);
}

contract SpokeMintAsset is Script {
    uint256 private constant MINT_AMOUNT = 10_000 * 1e6;
    uint256 private constant MASTER_BALANCE = 10 ether;

    function run() external {
        address usdc = vm.envAddress("ASSET_ADDRESS");
        address recipient = vm.envAddress("RECIPIENT");

        address master = IUSDC(usdc).masterMinter();

        _configureAndMint(usdc, master, recipient);
    }

    function _configureAndMint(
        address usdc,
        address master,
        address recipient
    ) private {
        vm.startPrank(master);
        vm.deal(master, MASTER_BALANCE);

        bool okCfg = IUSDC(usdc).configureMinter(master, type(uint256).max);
        require(okCfg, "ERC20: configureMinter failed");

        bool okMint = IUSDC(usdc).mint(recipient, MINT_AMOUNT);
        require(okMint, "ERC20: mint failed");

        vm.stopPrank();
    }
}