// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "src/Vault.sol";
import "src/Rebalancer.sol";

import "./ERC20Mock.sol";
import "./BalancerVaultV2Mock.sol";
import "./BalancerPoolV2Mock.sol";

contract VaultTest is Test {
    Vault public vault;
    Rebalancer public rebalancer;
    BalancerVaultV2Mock public balancer;
    BalancerPoolV2Mock public pool;

    ERC20Mock public token0;
    ERC20Mock public token1;
    address public constant user = address(1337);

    function setUp() public {
        vm.startPrank(user);

        token0 = new ERC20Mock("USDC stable coin", "USDC");
        token1 = new ERC20Mock("Wrapped ETH", "WETH");
        vault = new Vault(address(token0), address(token1));
        balancer = new BalancerVaultV2Mock();
        pool = new BalancerPoolV2Mock();
        rebalancer = new Rebalancer(address(balancer));

        token0.mint(user, 1e40);
        token1.mint(user, 1e40);

        balancer.setPoolAddress(address(pool));
        balancer.setPoolToken0Address(address(token0));
        balancer.setPoolToken1Address(address(token1));

        vault.setRebalancer(address(rebalancer));
    }

    function test_deposit() public {
        token0.approve(address(vault), 1000);
        token1.approve(address(vault), 5000);

        vault.deposit(1000, 5000);

        assertEq(token0.balanceOf(address(vault)), 1000);
        assertEq(token1.balanceOf(address(vault)), 5000);
    }

    function test_rebalance_simple() public {
        balancer.setPoolToken0Balance(10000000000000000000000000);
        balancer.setPoolToken1Balance(10000000000000000000000000);

        token0.approve(address(vault), 1e40);
        token1.approve(address(vault), 1e40);

        vault.deposit(5000000000000000000, 5000000000000000000);
        vault.rebalance(30, "");

        assertEq(vault.estimateCurrentRatio(""), 30);
    }

    function test_rebalance_small() public {
        balancer.setPoolToken0Balance(100);
        balancer.setPoolToken1Balance(200);

        token0.approve(address(vault), 1e40);
        token1.approve(address(vault), 1e40);

        vault.deposit(10, 20);
        vault.rebalance(40, "");

        assertApproxEqAbs(vault.estimateCurrentRatio(""), 40, 5);
    }

    function test_rebalance_large() public {
        balancer.setPoolToken0Balance(1e40);
        balancer.setPoolToken1Balance(1e40);

        token0.approve(address(vault), 1e40);
        token1.approve(address(vault), 1e40);

        vault.deposit(1e30, 8e30);
        vault.rebalance(15, "");

        assertEq(vault.estimateCurrentRatio(""), 15);
    }
}
