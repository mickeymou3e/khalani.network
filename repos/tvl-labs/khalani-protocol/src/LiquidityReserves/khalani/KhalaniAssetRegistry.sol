pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../Tokens/IERC20MintableBurnable.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

abstract contract KhalaniAssetRegistry is Ownable {

    event TokenRegistered(uint256 indexed chainId, address indexed sourceToken, address indexed mirrorToken);
    event TokenMinted(address indexed mirrorToken, address receiver, uint256 amount);
    event TokenBurned(address indexed mirrorToken, uint256 amount);

    mapping(uint256 => mapping(address => address)) public sourceToMirrorMap;
    mapping(uint256 => mapping(address => address)) public mirrorToSourceMap;

    function registerToken(uint256 chainId, address sourceToken, address mirrorToken) external {
        require(sourceToMirrorMap[chainId][sourceToken] == address(0), "KhalaniAssetRegistry: Token already registered");
        require(mirrorToSourceMap[chainId][mirrorToken] == address(0), "KhalaniAssetRegistry: Token already registered");
        require(sourceToken != address(0), "KhalaniAssetRegistry: Invalid source token address");
        require(mirrorToken != address(0), "KhalaniAssetRegistry: Invalid mirror token address");
        sourceToMirrorMap[chainId][sourceToken] = mirrorToken;
        mirrorToSourceMap[chainId][mirrorToken] = sourceToken;
        emit TokenRegistered(chainId, sourceToken, mirrorToken);
    }

    function getMirrorToken(uint256 chainId, address sourceToken) public view returns (address) {
        require(sourceToMirrorMap[chainId][sourceToken] != address(0), "KhalaniAssetRegistry: Mirror token not found");
        return sourceToMirrorMap[chainId][sourceToken];
    }

    function getSourceToken(uint256 chainId, address mirrorToken) public view returns (address) {
        require(mirrorToSourceMap[chainId][mirrorToken] != address(0), "KhalaniAssetRegistry: Source token not found");
        return mirrorToSourceMap[chainId][mirrorToken];
    }

    function isTokenRegistered(uint256 chainId, address token) external view returns (bool) {
        return sourceToMirrorMap[chainId][token] != address(0) || mirrorToSourceMap[chainId][token] != address(0);
    }
}