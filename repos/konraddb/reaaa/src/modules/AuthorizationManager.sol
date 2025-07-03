// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuthorizationManager is Ownable {
    mapping(address minter => bool) private s_authorizedMinters;
    mapping(address locker => bool) private s_authorizedLockers;

    error AuthorizationManager__UnauthorizedCaller(address minter);

    event AuthorizedMinterAdded(address indexed minter);
    event AuthorizedMinterChecked(address indexed minter);
    event AuthorizedMinterRemoved(address indexed minter);

    event AuthorizedLockerAdded(address indexed locker);
    event AuthorizedLockerRemoved(address indexed locker);

    constructor() Ownable() {}

    function addAuthorizedMinter(address minter) public onlyOwner {
        s_authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }

    function removeAuthorizedMinter(address minter) public onlyOwner {
        s_authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }

    function checkAuthorizedMinter(address minter) public {
        if (!isAuthorizedMinter(minter)) {
            emit AuthorizedMinterChecked(minter);
            revert AuthorizationManager__UnauthorizedCaller(minter);
        }
    }

    function isAuthorizedMinter(address minter) public view returns (bool) {
        return s_authorizedMinters[minter];
    }

    function addAuthorizedLocker(address locker) public onlyOwner {
        s_authorizedLockers[locker] = true;
        emit AuthorizedLockerAdded(locker);
    }

    function removeAuthorizedLocker(address locker) public onlyOwner {
        s_authorizedLockers[locker] = false;
        emit AuthorizedLockerRemoved(locker);
    }

    function checkAuthorizedLocker(address locker) public view {
        if (!s_authorizedLockers[locker]) {
            revert AuthorizationManager__UnauthorizedCaller(locker);
        }
    }

    function isAuthorizedLocker(address locker) public view returns (bool) {
        return s_authorizedLockers[locker];
    }
}
