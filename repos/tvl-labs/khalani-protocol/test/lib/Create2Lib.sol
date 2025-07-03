//pragma solidity ^0.8.0;
//
//import "../../src/Nexus/KhalaInterChainAccount.sol";
//
//library Create2Lib {
//
//    bytes constant bytecode = type(KhalaInterChainAccount).creationCode;
//
//    function computeAddress(
//        address account,
//        address deployer
//    ) internal
//    pure
//    returns (address addr){
//        bytes32 salt = _salt(account);
//        bytes32 bytecodeHash = bytes32(keccak256(bytecode));
//        assembly {
//            let ptr := mload(0x40) // Get free memory pointer
//            mstore(add(ptr, 0x40), bytecodeHash)
//            mstore(add(ptr, 0x20), salt)
//            mstore(ptr, deployer) // Right-aligned with 12 preceding garbage bytes
//            let start := add(ptr, 0x0b) // The hashed data starts at the final garbage byte which we will set to 0xff
//            mstore8(start, 0xff)
//            addr := keccak256(start, 85)
//        }
//    }
//
//    function _salt(address _sender) internal pure returns (bytes32)
//    {
//        return bytes32(abi.encodePacked(_sender));
//    }
//}