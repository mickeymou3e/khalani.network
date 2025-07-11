pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/ReserveVault/Vault.sol";
import "../src/ReserveVault/VaultFactory.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";

contract VaultFactoryTest is Test {
    error Shutdown();

    event NewVault(address indexed vaultAddress, address indexed asset);
    event FactoryShutdown();

    VaultFactory vaultFactory;
    address asset;
    function setUp() public {
        vaultFactory = new VaultFactory(msg.sender);
        asset = address(new ERC20("USDC","usdc"));
    }

    function test_DeployVault() public {
        //vars
        string memory name = "USDCReserveVault";
        string memory symbol = "usdc.rv";
        address roleManger = vm.addr(1);
        //test
        vm.expectEmit(address(vaultFactory));
        emit NewVault(vaultFactory.getVaultFromUnderlying(asset, name, symbol), asset);
        address vault = vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
        assertEq(address(vaultFactory.getVaultFromUnderlying(asset, name, symbol)), address(vault));
        assertTrue(vaultFactory.isVaultDeployed(vault));
    }

    function test_DeployVault_InvalidCaller(address randomAddress) public {
        //vars
        string memory name = "USDCReserveVault";
        string memory symbol = "usdc.rv";
        address roleManger = vm.addr(1);
        //test
        vm.assume(randomAddress != address(this));
        vm.prank(randomAddress);
        vm.expectRevert("Must have VAULT_DEPLOYER_ROLE to deploy new Vault");
        vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
    }

    function test_DeployVault_FactoryShutdown() public {
        //vars
        string memory name = "USDCReserveVault";
        string memory symbol = "usdc.rv";
        address roleManger = vm.addr(1);
        //test
        vm.prank(msg.sender);
        vaultFactory.shutdownFactory();
        vm.expectRevert(Shutdown.selector);
        vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
    }

    function test_ShutdownFactory() public {
        vm.expectEmit(address(vaultFactory));
        vm.startPrank(msg.sender);
        vaultFactory.shutdown();
        emit FactoryShutdown();
        vaultFactory.shutdownFactory();
        vm.expectRevert(Shutdown.selector);
        vaultFactory.shutdownFactory();
        vm.stopPrank();
    }

    function test_ShutdownFactory_InvalidCaller(address randomAddress) public {
        vm.assume(randomAddress != address(this) || randomAddress != msg.sender);
        vm.prank(randomAddress);
        vm.expectRevert("Must have DEFAULT_ADMIN_ROLE to shutdown");
        vaultFactory.shutdownFactory();
    }

    function test_NoDuplicateVaults() public {
        //vars
        string memory name = "USDCReserveVault";
        string memory symbol = "usdc.rv";
        address roleManger = vm.addr(1);
        //test
        address vault = vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
        vm.expectRevert();
        address vault1 = vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
    }

    function test_IsVaultDeployed() public {
        //vars
        string memory name = "USDCReserveVault";
        string memory symbol = "usdc.rv";
        address roleManger = vm.addr(1);
        //test
        address vault = vaultFactory.deployNewVault(asset, name, symbol, roleManger, 10000);
        assertTrue(vaultFactory.isVaultDeployed(vault));
        assertFalse(vaultFactory.isVaultDeployed(address(0)));
    }
}