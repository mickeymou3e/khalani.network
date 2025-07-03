// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../test/Mock/MockPermit2.sol";

library IntentsLib {
    bytes32 constant TOKEN_PERMISSIONS_TYPEHASH =
        keccak256("TokenPermissions(address token,uint256 amount)");
    bytes32 constant PERMIT_TRANSFER_FROM_TYPEHASH = keccak256(
        "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
    );

    function _getEIP712Hash(IPermit2.PermitTransferFrom memory permit, address spender, bytes32 domainSeparator)
        internal
        view
        returns (bytes32 h)
    {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            domainSeparator,
            keccak256(abi.encode(
                PERMIT_TRANSFER_FROM_TYPEHASH,
                 keccak256(abi.encode(
                    TOKEN_PERMISSIONS_TYPEHASH,
                    permit.permitted.token,
                    permit.permitted.amount
                )),
                spender,
                permit.nonce,
                permit.deadline
            ))
        ));
    }

    function _randomUint256() internal view returns (uint256) {
        return uint256(_randomBytes32());
    }

    function _randomBytes32() internal view returns (bytes32) {
        return keccak256(abi.encode(
            tx.origin,
            block.number,
            block.timestamp,
            block.coinbase,
            address(this).codehash,
            gasleft()
        ));
    }

    function _randomAddress() internal view returns (address payable) {
        return payable(address(uint160(_randomUint256())));
    }
}