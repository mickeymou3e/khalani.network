# Tunnel Vision Labs Coding Exercise

## Goal

To demonstrate your technical skills and fundamental understanding of the EVM, Solidity, Smart Contract development.

### Objective

* Design a vault rebalancer contract using a Balancer v2.
* Write a bot that automatically triggers rebalancing actions upon certain conditions. You may write this in whatever language you desire.
* Simple UI to display data about the bot / vaults. You may write this in whatever language you desire.

### Details

* Create a vanilla vault that custodies 2 different assets (ERC20).
* The vault should start with an arbitrary ratio of asset A to asset B.
* Create a Rebalancer contract that brings the two assets into a desired ratio.
* The Rebalancer should leverage Balancer v2.

### Assumptions

For the purposes of this exercise, use token pairs that can be swapped directly and there is sufficient liquidity (ex: WETH/USDC or WBTC/WETH).

### Deliverables

* Rebalancer Contract
* Vault Contract
* Test Suite
* Bot code
* UI code.

### Evaluation

The design will be evaluated on completeness, readability (including in-line comments), and gas efficiency. Our focus will be on the Rebalancer Contract and the Test Suite. Your test suite should demonstrate a strong approach to TDD. The vault contract is less important, it simply needs to work, so don’t spend too much time on it.

### Bonus Points

A Vault and Rebalancer that supports N assets.

### ToolKit

* Project: Foundry
* Testing Framework: Forge
* Solidity: latest version

Please don't hesitate to ask questions or clarifications on any of the above.

## Submission

Please submit your solution by sharing a private repository and invite `samtvlabs` to it.

