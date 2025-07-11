pragma solidity ^0.8.0;

import "../../src/InterchainMessaging/Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../src/LiquidityReserves/khalani/LiquidityProjector.sol";

contract MockBridgeFacet {

    address public immutable liquidityProjector;

    constructor() {
        liquidityProjector = address(new MockLiquidityProjector());
    }
    event BridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );

    function send(
        uint256 rootChainId,
        address rootSender,
        uint256 destinationChainId,
        Token[] calldata tokens,
        address target,
        bytes calldata message
    ) external {
        emit BridgeRequest(msg.sender, destinationChainId, tokens, target);
        //dummy lockAndBurn
        MockLiquidityProjector(liquidityProjector).lockOrBurn(destinationChainId, msg.sender, tokens);
    }

    function getLiquidityProjector() external view returns (address) {
        return liquidityProjector;
    }
}

contract MockLiquidityProjector {

    //dummy implementation of lockOrBurn
    //not the correct implimentation
    //this just pulls any tokens sent to it
    function lockOrBurn(
        uint256 destinationChainId,
        address sender,
        Token[] memory tokens
    ) external returns (Token[] memory) {
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i].tokenAddress).transferFrom(sender, address(this), tokens[i].amount);
        }
        return new Token[](0); //dummy return
    }
}