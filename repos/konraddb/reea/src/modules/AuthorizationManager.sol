// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuthorizationManager is Ownable {
    mapping(address minter => bool) private s_authorizedMinters;

    error AuthorizationManager__UnauthorizedCaller();

    event AuthorizedMinterAdded(address indexed minter);
    event AuthorizedMinterRemoved(address indexed minter);

    function addAuthorizedMinter(address minter) external onlyOwner {
        s_authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }

    function removeAuthorizedMinter(address minter) external onlyOwner {
        s_authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }

    function checkAuthorizedMinter(address minter) external view {
        if (!s_authorizedMinters[minter]) {
            revert AuthorizationManager__UnauthorizedCaller();
        }
    }

    function isAuthorizedMinter(address minter) external view returns (bool) {
        return s_authorizedMinters[minter];
    }
}
