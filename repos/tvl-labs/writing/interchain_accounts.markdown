## [WIP]Interchain Accounts 
 
### Motivation
 
Most DeFi applications are built with logic depending on the account that sends the transaction. For example, a privileged function may check `msg.sender()` as authentication; governance or token distribution schemes may also base their logic on the account that sends in the transaction. 
 
In the cross-chain contract call context, it’s always the relayer that sends in the transactions on behalf of the originator users on the source chain. In other words, the `msg.sender()` on the destination chain is always the relayer.  It’s possible to modify the contracts to not to depend on `msg.sender()`, for example, by requiring the account to be passed in as an argument. However, the modification required may be too expensive and would be required for every application on the destination chain.
 
### Proposed Solution
 
Nexus creates distinct and deterministic local accounts on the Khala chain for user’s remote accounts. The local account is generated with only the input of the user's remote_account. Therefore if the user has multiple accounts with the same addresses on multiple EVM chains, they’ll be computed to be the same local Khala Chain account.
 
```
local_khala_account = fn(remote_account)
```
 
Nexus would always mint tokens into those accounts for the remote user, and always proxy calls through those accounts.
 
Those accounts serve as mirror accounts to user’s remote accounts. When tokens are locked or burned on the remote chain, they’re minted to the user’s mirror accounts on the Khala chain. On the other hand, when tokens are burned from their mirror accounts on the Khala Chain, they’re minted or unlocked from the remote chain. User balances are segregated into their self owned accounts.
 
Those local accounts should only accept relayers as callers. 
 
### Benefits of the Solution
 
 
Those accounts serve as proxy accounts that relayers can call, so that apps on the Khala Chain (for example, Balancer) could still rely on `msg.sender()` for its internal logic without modifications. 
 
### Implementation
 
- The calls happen as normal on the destination chain
- On Axon reciever , we require the additional logic to check if the user possess an interchain account. If not , we create it for them.
 
```solidity
   function depositTokenAndCall(
       address account,
       address token,
       uint256 amount,
       uint32 chainId,
       bytes32 toContract,
       bytes memory data
   ) internal nonReentrant {
       require(data.length > 0 , "empty call data");
       LogDepositAndCall(
           token,
           account,
           amount,
           chainId
       );
 
       if !(account in khalaWallets) {
           createKhalaWallet()
       }
 
       s.balances[account][token] += amount;
       IERC20Mintable(token).mint(address(account),amount);
       _proxyCall(toContract,data);
   }
```
