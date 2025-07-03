The Interchain Liquidity Hub comprises two primary types of liquidity pools:

**Cross-Chain Liquidity Pools (CCLPs)**

CCLPs are engineered to price inter-chain, same-asset liquidity. Chain-specific, same-asset liquidity (for instance, USDCs from multiple blockchains) are paired with a chain-agnostic Khalani native asset (in this case, klnUSDC). Using a forgiving bonding curve for pricing, these pools allow efficient cross-chain value transfers and incentivize arbitrageurs to maintain equilibrium across various blockchains. For instance, if demand for Ethereum's USDC exceeds supply, and the BNB Chain's USDC has a surplus supply, the protocol would marginally increase the price of Ethereum's USDC above the canonical USDC price, and decrease BNB Chain's USDC price. This incentivizes a higher supply to Ethereum and increased withdrawal from the BNB Chain, ensuring that the protocol's reserves correspond with the original provided balances.

**Cross-Asset Liquidity Pools (CALPs)**

CALPs bridge similar but different assets, such as USDC, USDT, and other USD-pegged stablecoins. CALPs are paired with Kai, Khalani's native USD-paired stablecoin, allowing liquidity providers to clearly understand their risk exposures. Thanks to CALPs, users can carry out cross-chain value transfers between different assets.
