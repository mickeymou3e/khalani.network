//pragma solidity ^0.8.0;
//
//import "./LibAppStorage.sol";
//import "../Call.sol";
//library LibNexusABI{
//
//    //encode the input data using abi.encodePacked
//    function encodeData1(LibAppStorage.TokenBridgeAction action, address account, address token, uint256 amount, Call[] memory calls) internal pure returns (bytes memory) {
//        bytes memory packed1 = abi.encodePacked(action, account, token, amount);
//        return abi.encodePacked(packed1, abi.encode(calls));
//    }
//
//    //function to decode the data encoded by encode1 function
//    function decodeData1(bytes calldata data) internal pure returns (address account, address token, uint256 amount, Call[] memory calls) {
//        account = address(bytes20(data[1:21]));
//        token = address(bytes20(data[21:41]));
//        amount = abi.decode(data[41:73], (uint256));
//        calls = abi.decode(data[73:], (Call[]));
//    }
//
//    function encodeData2(LibAppStorage.TokenBridgeAction action, address account, address[] memory tokens, uint256[] memory amounts, Call[] memory calls) internal pure returns (bytes memory) {
//        bytes memory packed1 = abi.encodePacked(action, account);
//        bytes memory packed2 = abi.encode(tokens, amounts, calls);
//        return abi.encodePacked(packed1, packed2);
//    }
//
//    //function to decode data encoded by encode2 function
//    function decodeData2(bytes calldata data) internal pure returns (address account, address[] memory tokens, uint256[] memory amounts, Call[] memory calls) {
//        account = address(bytes20(data[1:21]));
//        (tokens, amounts, calls) = abi.decode(data[21:], (address[], uint256[], Call[]));
//    }
//
//    //function to encode action and calls for bridgeCall
//    function encodeData3(LibAppStorage.TokenBridgeAction action, address account, Call[] memory calls) internal pure returns (bytes memory) {
//        bytes memory packed1 = abi.encodePacked(action, account);
//        return abi.encodePacked(packed1, abi.encode(calls));
//    }
//
//    //function to decode data encoded by encode3 function
//    function decodeData3(bytes calldata data) internal pure returns (address account, Call[] memory calls) {
//        account = address(bytes20(data[1:21]));
//        calls = abi.decode(data[21:], (Call[]));
//    }
//}