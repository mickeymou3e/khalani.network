This document specifies all Khalani's assets - their purpose in the ecosystem, their expectations, stability mechanism 

## Pan

- Pan is Khalani's stable coin that pegs to the US Dollar
- Pan is backed by a basket of fiat based assets that can be 1:1 redeemed to the US Dollar.
- The initial list:
    - USDC, USDT, Dai and BUSD on Ethereum
    - USDC and USDT on Avalanche
    - BUSD on BNB Chain
- Khalani holds the above assets on-chain (version 1) or invest them through AMOs (future) as protocol owned liquidity

#### Pan's Liquidity

- Khalani manages Pan liquidity with on-chain AMOs (Algorithmic Market Operations)
- Khalani injects protocol owned assets (that backs Pan) into white listed liquidity pools
    - such as a curve 3crv/pan pool
    - such as a balancer bb-a-usd/pan pool
    - such as aave's PAN reserve
    - such as Hadouken's PAN reserve

#### Pan's Stability

- Pan's price stability is managed with a mint/redeem mechanism (v1)
    - users can mint PAN with whitelisted backed assets
    - users can redeem PAN to any of the whitelisted assets 1:1 with a 0.5% fee
- Pan's price stability is managed with the AMOs (v2, after sufficient liquidity bootstrap)
    - when Pan's price is over $1, the protocol injects Pan into the AMO pools to bring PAN's price back to $1
    - when Pan's price is lower than $1, the protocol removes Pan from the AMO pools to bring PAN's price back to $1

#### Pan's Risk

Pan's depegging risk could come from:
    - backed token depeg risk. more specifically, depegging of any tokens that the AMO holds would make an impact on Khalani's balance sheet. if a token's value goes to zero, then all the AMOs containing that token would go to zero value, significantly impacting Pan's peg.
    - AMOs security risk. If an AMO's smart contracts are exploited with fund loss, Khalani's balance sheet will be impactedwhich will impact Pan's peg.

Emergency Reserve and emergency shut down
    - TBD

## PanCrypto

PanCrytos are Khalani's stable coins that peg to major cryptocurrencies. Examples are PanETH, PanBTC, PanCKB, etc. We'll use PanETH as an example:

### PanETH

- PanETH is Khalani's stable coin that pegs to ETH
- PanETH is backed by a basket of ETH tokens:
- The initial list:
    - ETH on Ethereum, Optimism and Arbitrum
- Khalani holds the above assets in on-chain AMOs as POL

#### PanETH's Liquidity

- Khalani manages PanETH liquidity with on-chain AMOs (Algorithmic Market Operations)
- Khalani injects protocol owned assets (ETH) into white listed liquidity pools
    - such as a curve ETH/panETH pool
    - such as aave's ETH reserve

#### PanETH's Stability

- PanETH's price stability is managed with a mint/redeem mechanism (v1)
    - users can mint panETH with ETH
    - users can redeem ETH with panETH 1:1 with a fee (0.5%)
- Pan's price stability is managed with the AMOs (v2, after sufficient liquidity bootstrap)
    - when PanETH's price is over 1 ETH, the protocol injects PanETH into the AMO pools to bring PAN's price back to 1 ETH
    - when PanETH's price is lower than 1 ETH, the protocol removes PanETH from the AMO pools to bring PAN's price back to 1 ETH

## Pan Reserve Tokens

Pan Reserve Tokens (PRTs) are deposit receipt when users deposit tokens from one of the connected blockchains into the Khalani Chain. For example, when a user deposit 1 USDC to be transferred to the Khalani Chain, they receive 1 prUSDCeth token on the Khalani Chain. PRTs represent maximum exit liquidity that Khalani Protocol is able to provide for a specific asset on a blockchain.

We expect PRTs to only exist on the Khalani Chain, where users can provide, trade and rebalance cross-chain liquidity. When a user tries to perform a cross chain transfer, for example, transfering USDC on Ethereum to USDT on the BNB Chain, they'd turn their Ethereum USDC to prUSDCeth, then trade it into prUSDTbnb with a small fee, and finally use it to get USDT on the BNB Chain.

#### PRTs liquidity & Stability

By default, PRTs are kept in the custody vaults and can always be redeemed 1:1.

#### The Possibility of managing PRD tokens with AMOs

It's possible to use AMOs to earn yield on the deposited assets backing the PRDs. But since those assets are meant to peg to a token, instead of a price, we'd want single token exposure AMOs, for example, AAVE reserve pools.

When a token has an explicit list of backing tokens through PSM like mechanism, that token's AMOs can also have exposure to those backing tokens.
