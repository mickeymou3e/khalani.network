pragma solidity ^0.8.0;

import "../../Tokens/IERC20MintableBurnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ILiquidityProjector.sol";

contract LiquidityProjector is ILiquidityProjector {
    address public immutable nexus;
    address public immutable kai;
    address public immutable owner;
    mapping (uint256 => mapping(address => address)) private mirrorTokenMap;
    mapping (uint256 => mapping(address => address)) private sourceTokenMap;

    constructor(address _nexus, address _kai) {
        owner = msg.sender;
        nexus = _nexus;
        kai = _kai;
    }

    modifier onlyNexus() {
        if(msg.sender != nexus){
            revert InvalidNexus();
        }
        _;
    }

    modifier onlyOwner() {
        if(msg.sender != owner){
            revert NotValidOwner();
        }
        _;
    }

    //----------------------Setters----------------------//
    function setMirrorToken(
        uint256 chainId,
        address token,
        address mirrorToken
    ) external onlyOwner {
        mirrorTokenMap[chainId][token] = mirrorToken;
        sourceTokenMap[chainId][mirrorToken] = token;
        emit MirrorTokenSet(chainId, token, mirrorToken);
    }

    //----------------------External----------------------//
    /**
    * @dev lock or burn tokens
    * @param _chainId chainId to send token to
    * @param _sender sender address
    * @param tokens array of tokens to lock or burn
    */
    function lockOrBurn(
        uint256 _chainId,
        address _sender,
        Token[] memory tokens
    ) external onlyNexus returns (Token[] memory){
        emit LockOrBurn(_sender, tokens);
        for(uint i; i<tokens.length;){
            //call reserves manager to lock kai / burn mirror tokens
            if(tokens[i].tokenAddress == kai){
                SafeERC20.safeTransferFrom(
                    IERC20(tokens[i].tokenAddress),
                    _sender,
                    address(this),
                    tokens[i].amount
                );
            } else {
                IERC20MintableBurnable(tokens[i].tokenAddress)
                    .burnFrom(
                        _sender,
                        tokens[i].amount
                    );
            }
            tokens[i].tokenAddress = sourceTokenMap[_chainId][tokens[i].tokenAddress];
            unchecked{
                ++i;
            }
        }
        return tokens;
    }

    /**
    * @dev mint or unlock tokens
    * @param chainId chain id of the tokens
    * @param target target address to receive tokens
    * @param tokens array of tokens to mint or unlock
    */
    function mintOrUnlock(
        uint256 chainId,
        address target,
        Token[] memory tokens
    ) external onlyNexus returns (Token[] memory){
        emit MintOrUnlock(chainId, target, tokens);
        for(uint i; i<tokens.length;){
            //call reserves manager to unlock kai / mint mirror tokens
            address token = mirrorTokenMap[chainId][tokens[i].tokenAddress];
            if(token == address(0)){
                revert AssetNotFound(tokens[i].tokenAddress);
            }
            tokens[i].tokenAddress = token;
            if(token == address(kai)){
                SafeERC20.safeTransfer(
                    IERC20(token),
                    target,
                    tokens[i].amount
                );
            } else{
                IERC20MintableBurnable(token).mint(
                    target,
                    tokens[i].amount
                );
            }
            unchecked{
                ++i;
            }
        }
        return tokens;
    }

}