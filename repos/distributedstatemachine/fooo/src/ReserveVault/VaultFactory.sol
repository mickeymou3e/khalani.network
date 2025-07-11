// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Context.sol";

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Vault.sol";

/**
* @title VaultFactory
* @notice Factory contract to deploy new vaults.
*/
contract VaultFactory is Context, AccessControlEnumerable {
    using Clones for address;

    error Shutdown();

    event NewVault(address indexed vaultAddress, address indexed asset);
    event FactoryShutdown();

    address public immutable vaultImplementation;
    bool public shutdown;
    bytes32 public constant VAULT_DEPLOYER_ROLE = keccak256("VAULT_DEPLOYER_ROLE");

    //will be deployed through the registry contract
    constructor(address eoaAdmin) {
        _setupRole(DEFAULT_ADMIN_ROLE, eoaAdmin);
        //both eoa admin / registry can deploy new vaults
        // it is preferred that eoa deploy experimental vault and the registry deploy production vaults
        _setupRole(VAULT_DEPLOYER_ROLE,eoaAdmin);
        _setupRole(VAULT_DEPLOYER_ROLE, msg.sender); //msg.sender is going to be the Reserve Vault Registry
        vaultImplementation = address(new Vault());
    }

    /**
     * @notice Deploys a new vault base on the vaultImplementation.
     * @param asset The asset to be used for the vault.
     * @param _name The name of the new vault.
     * @param _symbol The symbol of the new vault.
     * @param roleManager The address of the role manager.
     * @param profitMaxUnlockTime The time over which the profits will unlock.
     * @return The address of the new vault.
     */
    function deployNewVault(
        address asset,
        string memory _name,
        string memory _symbol,
        address roleManager,
        uint256 profitMaxUnlockTime
    ) external returns (address) {
        require(hasRole(VAULT_DEPLOYER_ROLE, _msgSender()), "Must have VAULT_DEPLOYER_ROLE to deploy new Vault");
        //validate if asset is a smart contract
        require(asset.code.length!=0, "Asset must be a smart contract");
        //validate roleManager
        require(roleManager != address(0), "Role manager cannot be zero address");
        //validate profitMaxUnlockTime
        require(profitMaxUnlockTime > 0, "Profit max unlock time must be greater than zero");

        if (shutdown) {
            revert Shutdown();
        }
        bytes32 salt = keccak256(abi.encode(asset, _name, _symbol));
        address vaultAddress = _createAndInitializeVault(asset, _name, _symbol, roleManager, profitMaxUnlockTime, salt);
        emit NewVault(vaultAddress, asset);
        return vaultAddress;
    }

    /**
     * @notice Creates a new vault and initializes it.
     * @param asset The asset to be used for the vault.
     * @param _name The name of the new vault.
     * @param _symbol The symbol of the new vault.
     * @param roleManager The address of the role manager.
     * @param profitMaxUnlockTime The time over which the profits will unlock.
     * @param _salt The salt to be used for the vault.
     * @return The address of the new vault.
     */
    function _createAndInitializeVault(
        address asset,
        string memory _name,
        string memory _symbol,
        address roleManager,
        uint256 profitMaxUnlockTime,
        bytes32 _salt
    ) internal returns (address) {
        address vault = vaultImplementation.cloneDeterministic(_salt);
        Vault(vault).initialize(asset, _name, _symbol, roleManager, profitMaxUnlockTime);
        return vault;
    }

    /**
     * @notice To stop new deployments through this factory.
     * @dev A one time switch available for the owner to stop new
     * vaults from being deployed through the factory.
     */
    function shutdownFactory() external {

        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have DEFAULT_ADMIN_ROLE to shutdown");

        if (shutdown) {
            revert Shutdown();
        }
        shutdown = true;

        emit FactoryShutdown();
    }

    /**
     * @notice Computes a Vault's address from its accepted underlying token.
     * @dev The Vault returned may not be deployed yet. Use isVaultDeployed to check.
     * @param asset The ERC20 token address that the Vault should accept
     * @param _name The token name, the vault provides as shares to depositors
     * @param _symbol The token symbol,the vault provides as shares to depositors.
     */
    function getVaultFromUnderlying(address asset, string memory _name, string memory _symbol)
    external
    view
    returns (address)
    {
        bytes32 salt = keccak256(abi.encode(asset, _name, _symbol));
        address vault = vaultImplementation.predictDeterministicAddress(salt, address(this));

        return vault;
    }

    /**
     * @notice Returns if a Vault at an address has already been deployed.
     * @dev This function is useful to check the return values of getVaultFromUnderlying,
     * as it does not check that the Vault addresses it computes have been deployed yet.
     * @param vault The address of a Vault which may not have been deployed yet.
     * @return A boolean indicating whether the Vault has been deployed already.
     */
    function isVaultDeployed(address vault) external view returns (bool) {
        return vault.code.length > 0;
    }
}