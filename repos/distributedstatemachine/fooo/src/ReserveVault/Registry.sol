// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./VaultFactory.sol";

interface IERC4626 {
    function asset() external view returns (address);
}

contract Registry is Ownable {
    event NewDeployedVault(address indexed vault, address indexed asset);
    event NewStrategyRegistered(address indexed strategy, address indexed asset);

    // Struct stored for every deployed vault or strategy for
    // off chain use to easily retreive info.
    struct Info {
        // The token thats being used.
        address asset;
        // Time when the vault was deployed for easier indexing.
        uint256 deploymentTimeStamp;
    }

    // Custom name for this Registry.
    string public name;

    // Array of all tokens used as the underlying.
    address[] public assets;

    // Mapping to check if a specific `asset` has a vault.
    mapping(address => bool) public assetIsUsed;

    // asset => array of all deployed vaults.
    mapping(address => address[]) internal _deployedVaults;

    // asset => array of all deployed strategies.
    mapping(address => address[]) internal _deployedStrategies;

    // vault/strategy address => Info stuct.
    mapping(address => Info) public info;

    VaultFactory public immutable factory;

    constructor(string memory _name, address eoaAdmin) {
        name = _name;
        factory = new VaultFactory(eoaAdmin);
    }

    /**
     * @notice Returns the total numer of assets being used as the underlying.
     * @return The amount of assets.
     */
    function numAssets() external view returns (uint256) {
        return assets.length;
    }

    /**
     * @notice Get the full array of tokens being used.
     * @return The full array of underlying tokens being used/.
     */
    function getAssets() external view returns (address[] memory) {
        return assets;
    }

    /**
     * @notice The number of deployed vaults for a specific token.
     * @return The total number of deployed vaults.
     */
    function numDeployedVaults(address _asset) public view returns (uint256) {
        return _deployedVaults[_asset].length;
    }

    /**
     * @notice The number of deployed strategies for a specific token.
     * @return The total number of deployed strategies.
     */
    function numDeployedStrategies(address _asset) public view returns (uint256) {
        return _deployedStrategies[_asset].length;
    }

    /**
     * @notice Get the array of vaults deployed for an `_asset`.
     * @param _asset The underlying token used by the vaults.
     * @return The deployed vaults.
     */
    function getDeployedVaults(address _asset) external view returns (address[] memory) {
        return _deployedVaults[_asset];
    }

    /**
     * @notice Get the array of strategies deployed for an `_asset`.
     * @param _asset The underlying token used by the strategies.
     * @return The deployed strategies.
     */
    function getDeployedStrategies(address _asset) external view returns (address[] memory) {
        return _deployedStrategies[_asset];
    }

    /**
     * @notice Get all vaults deployed using the Registry.
     * @dev This will return a nested array of all vaults deployed
     * seperated by their underlying asset.
     *
     * This is only meant for off chain viewing and should not be used during any
     * on chain tx's.
     *
     * @return allDeployedVaults A nested array containing all vaults.
     */
    function getAllDeployedVaults() external view returns (address[][] memory allDeployedVaults) {
        address[] memory allAssets = assets;
        uint256 length = assets.length;

        allDeployedVaults = new address[][](length);
        for (uint256 i; i < length; ++i) {
            allDeployedVaults[i] = _deployedVaults[allAssets[i]];
        }
    }

    /**
     * @notice Get all strategies deployed through this registry.
     * @dev This will return a nested array of all deployed strategies
     * seperated by their underlying asset.
     *
     * This is only meant for off chain viewing and should not be used during any
     * on chain tx's.
     *
     * @return allDeployedStrategies A nested array containing all strategies.
     */
    function getAllDeployedStrategies() external view returns (address[][] memory allDeployedStrategies) {
        address[] memory allAssets = assets;
        uint256 length = assets.length;

        allDeployedStrategies = new address[][](length);
        for (uint256 i; i < length; ++i) {
            allDeployedStrategies[i] = _deployedStrategies[allAssets[i]];
        }
    }

    /**
     * @notice
     *    Create a new vault for the given asset.
     * @dev
     *   Throws if caller isn't `owner`.
     *   Emits a `NewDeployedVault` event.
     * @param _asset The asset that to be deposited into the new Vault.
     * @param _name Specify a custom Vault name. .
     * @param _symbol Specify a custom Vault symbol name.
     * @param _roleManager The address authorized for guardian interactions in the new Vault.
     * @param _profitMaxUnlockTime The time strategy profits will unlock over.
     * @return _vault address of the newly-deployed vault
     */
    function deployNewVault(
        address _asset,
        string memory _name,
        string memory _symbol,
        address _roleManager,
        uint256 _profitMaxUnlockTime
    ) public onlyOwner returns (address _vault) {
        // Deploy New vault.
        _vault = factory.deployNewVault(_asset, _name, _symbol, _roleManager, _profitMaxUnlockTime);

        // Register the vault with this Registry
        _registerVault(_vault, _asset, block.timestamp);
    }

    /**
     * @notice
     *    Adds an strategy to the list of "deployed" strategies for that asset.
     * @dev
     *    Throws if caller isn't `owner`.
     *    Emits a `NewDeployedStrategy` event.
     * @param _strategy The strategy that will be registered by the Registry.
     * @param _deploymentTimestamp The timestamp of when the strategy was deployed.
     */
    function registerStrategy(address _strategy, uint256 _deploymentTimestamp) external onlyOwner {
        address _asset = IERC4626(_strategy).asset();
        // Add to the deployed strategies arrays.
        _deployedStrategies[_asset].push(_strategy);

        // Set the Info struct for this strategy.
        info[_strategy] = Info({asset: _asset, deploymentTimeStamp: _deploymentTimestamp});

        if (!assetIsUsed[_asset]) {
            // We have a new asset to add
            assets.push(_asset);
            assetIsUsed[_asset] = true;
        }

        emit NewStrategyRegistered(_strategy, _asset);
    }

    function _registerVault(address _vault, address _asset, uint256 _deploymentTimestamp) internal {
        // Add to the deployed vaults arrays.
        _deployedVaults[_asset].push(_vault);

        // Set the Info struct for this vault
        info[_vault] = Info({asset: _asset, deploymentTimeStamp: _deploymentTimestamp});

        if (!assetIsUsed[_asset]) {
            // We have a new asset to add
            assets.push(_asset);
            assetIsUsed[_asset] = true;
        }

        emit NewDeployedVault(_vault, _asset);
    }
}