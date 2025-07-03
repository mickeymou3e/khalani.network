// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20, ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MTokenManager} from "./MTokenManager.sol";

contract MToken is ERC20Burnable, Ownable {
    // ***************** //
    // *** VARIABLES *** //
    // ***************** //
    address private immutable i_spokeTokenAddr;
    uint32 private immutable i_spokeChainId;
    MTokenManager private immutable s_mTokenManager;

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //

    constructor(string memory name, string memory symbol, address spokeAddr, uint32 spokeChainId, address mTokenManager)
        ERC20(name, symbol)
    {
        i_spokeTokenAddr = spokeAddr;
        i_spokeChainId = spokeChainId;
        s_mTokenManager = MTokenManager(mTokenManager);
        transferOwnership(mTokenManager);
    }

    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //

    function mint(address to, uint256 amount) external onlyOwner {
        s_mTokenManager.mintMToken(to, address(this), amount);
        emit Transfer(address(0), to, amount);
    }

    // ***************** //
    // **** PUBLIC **** //
    // ***************** //
    function transfer(address to, uint256 amount) public override returns (bool) {
        address from = _msgSender();
        s_mTokenManager.mTokenTransfer(from, to, amount, address(this));
        emit Transfer(from, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        s_mTokenManager.mTokenTransferFrom(spender, from, to, amount, address(this));
        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        s_mTokenManager.mTokenApprove(owner, spender, amount, address(this));
        emit Approval(owner, spender, amount);
        return true;
    }

    function burn(uint256 amount) public override {
        address from = _msgSender();
        s_mTokenManager.burnMToken(from, from, amount, address(this));
        emit Transfer(from, address(0), amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        address operator = _msgSender();
        s_mTokenManager.burnMToken(operator, account, amount, address(this));
        emit Transfer(account, address(0), amount);
    }

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    function totalSupply() public view override returns (uint256) {
        return s_mTokenManager.totalSupply(address(this));
    }

    function balanceOf(address account) public view override returns (uint256) {
        return s_mTokenManager.getBalanceOfUser(account, address(this));
    }

    function balanceOf(bytes32 resourceId) public view returns (uint256) {
        return s_mTokenManager.getBalanceOfResource(resourceId, address(this));
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return s_mTokenManager.getAllowance(owner, spender, address(this));
    }
}
