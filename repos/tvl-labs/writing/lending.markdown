Khalani Lending

Potential PMF / User's Goals

Borrowers

- keep my valuable assets on my primary chain (for example, Ethereum), while getting some stables to farm / play on another chain.
- mid/small cap tokens that can't be used as collaterals anywhere (your governance tokens of choice..)
- new chains where there isn't a lending market available, especially non-evm chains
- LP tokens for leverage

Lenders

- give PAN holders places to generate yield on their PAN.
- choose where to put their PAN to work based on risk / reward

(Borrow & Lend)ers

- collat on chain A, borrow PAN at a lower interest rate (a%) and supply it somewhere else at a higher interest rate (b%)
- equivalent of earning b-a % for their collateral; if the collateral itself is an interest bearing asset it's even better


Design Objectives:

- support multi-chain borrowing and lending
- support long tail assets, especially interest bearing assets as collaterals
- isolated risk control / avoid systematic risks
- aggregate cross chain liquidity for similar risk profile assets
- allow users to lend PAN as a pseudo savings account and borrow PAN with competitive rates
- market determined interest rates

High Level Product Design:
- isolated lending markets
- for each market, allow borrowing PAN with what the protocol considers as "equivalent risk profiles"
- time weighted interest rates targeting a specific pool utilization, and/or, time weighted interest rates targeting a specific amount of exit liquidity

Example isolated markets:

- ETH / Pan market
    - accepts collaterals: ETHeth, ETHbsc, ETHpolygon, ETHoptimism, ... PanETH
    - available for borrow: PAN

- BTC / Pan market
    - accepts collaterals: BTC, WBTCeth, WBTCpolygon, WBTCoptimism, ... PanBTC
    - available for borrow: PAN

- Stable USD / Pan market
    - accepts collaterals: USDCeth / PAN, USDTeth / PAN, ... 3CRV/PAN|eth, bb-a-USD/PAN|eth, ...
        - this is a whitelisted LP tokens that Khalani is using as AMOs
    - available for borrow: PAN

- stETH / wstETH / Pan market
    - accepts collaterals: wstETHeth, stETHeth, stETHpolygon, ...
    - available for borrow: PAN

- stETH / wstETH / Pan market
    - accepts collaterals: wstETHeth, stETHeth, stETHpolygon, ...
    - available for borrow: PAN

- CRVeth / CRVpolygon .... / Pan market

Example 1:  a user borrows PAN with ETH, operating from the Godwoken Chain

- User deposits ETH on Godwoken
- Nexus sends the ETH to the Khalani Chain in the user's interchain account wallet. This means users deposit ETH is locked on Godwoken, the same amount of ETHgw token are minted into the user's interchain account wallet.
- User borrows PAN against the ETH
- The PAN is borrowed into the user's interchain wallet and then sent back to the user on Godwoken

Example 2:  a user collateralize CKB on Godwoken, and receives loan in USDC on Ethereum

- User deposits CKB on Godwoken
- Nexus sends the CKB to the Khalani Chain in the user's interchain account wallet. This means users deposit CKB is locked on Godwoken, the same amount of CKBgw token are minted into the user's interchain account wallet on the Khalani Chain.
- User borrows PAN against the CKB
- The PAN is borrowed into the user's interchain wallet
- PAN is swapped to USDCeth on Khalani Chain
- USDCeth is withdrawn to Ethereum
