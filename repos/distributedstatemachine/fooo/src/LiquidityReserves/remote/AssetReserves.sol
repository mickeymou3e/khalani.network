pragma solidity ^0.8.0;

import "../../Tokens/IERC20MintableBurnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IAssetReserves.sol";
import "../../InterchainMessaging/Errors.sol";


contract AssetReserves is IAssetReserves{

    address public immutable nexus;
    address public owner;
    IERC20MintableBurnable public immutable kai;
    mapping (address => bool) public whiteListedAsset;

    constructor(
        address _nexus,
        address _kai
    ) {
        owner = msg.sender;
        nexus = _nexus;
        kai = IERC20MintableBurnable(_kai);
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

    //------------------------SETTERS------------------------//
    /**
    * @dev Adds an asset to the whitelist
    * @param asset The address of the asset to add
    */
    function addWhiteListedAsset(address asset) external onlyOwner {
        whiteListedAsset[asset] = true;
        emit AssetAddedToWhitelist(asset);
    }

    /**
    * @dev Removes an asset from the whitelist
    * @param asset The address of the asset to remove
    */
    function removeWhiteListedAsset(address asset) external onlyOwner {
        whiteListedAsset[asset] = false;
        emit AssetRemovedFromWhitelist(asset);
    }

    //------------------------GETTERS------------------------//
    function getWhiteListedAsset(address asset) external view returns(bool) {
        return whiteListedAsset[asset];
    }

    //------------------------EXTERNAL------------------------//
    /**
    * @dev Locks or burns tokens
    * @param _sender The address of the sender
    * @param tokens The tokens to lock or burn
    */
    function lockOrBurn(
        address _sender,
        Token[] calldata tokens
    ) external onlyNexus {
        emit LockOrBurn(_sender, tokens);
        for(uint i; i<tokens.length;){
            //call reserves manager to burn kai / lock whitelisted tokens
            if(tokens[i].tokenAddress == address(kai)){
                kai.burnFrom(_sender, tokens[i].amount);
            } else if(whiteListedAsset[tokens[i].tokenAddress]) {
                SafeERC20.safeTransferFrom(
                    IERC20(tokens[i].tokenAddress),
                    _sender,
                    address(this),
                    tokens[i].amount
                );
            } else {
                revert AssetNotWhiteListed(tokens[i].tokenAddress);
            }

            unchecked{
                ++i;
            }
        }
    }

    /**
    * @dev Mints or unlocks tokens
    * @param _target The address of the target
    * @param tokens The tokens to mint or unlock
    */
    function mintOrUnlock(
        address _target,
        Token[] calldata tokens
    ) external onlyNexus {
        emit MintOrUnlock(_target, tokens);
        for(uint i; i<tokens.length;){
            //call reserves manager to mint kai / unlock and transfer whitelisted tokens tokens
            address token = tokens[i].tokenAddress;
            if(token == address(kai)){
                kai.mint(_target, tokens[i].amount);
            } else{
                if(whiteListedAsset[token]){
                    SafeERC20.safeTransfer(
                        IERC20(token),
                        _target,
                        tokens[i].amount
                    );
                } else {
                    revert AssetNotFound(tokens[i].tokenAddress);
                }
            }
            unchecked{
                ++i;
            }
        }
    }

}