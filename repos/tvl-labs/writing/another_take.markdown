Ethereum



Vortex
  - addLiquidity(PAN, USDC)
    - calls Nexus.depositTokensAndCall([PAN, USDC], ['addLiquidity', contractAddress, [params]])
  - transfer(1000, USDC, USDT, Avax, slippageTolerance=.,.., ...)
    - calls Nexus.depositTokensAndCall([1000, USDC], ['tradeAndWithdraw', ..... ])

Hadouken
  - addReserve(USDC)
  - calls NexusOutbox(HadoukenContractAddress, [otherParams]

Khalani
  - transferPan(300, recipientAddress, chainId)
    - if chainId = khala chain
      - Nexus.depositTokensAndCall([khalaToken, 300], ['transfer', KhalaniERC20, 0x11131412312])
    - else
      - Nexus.depositTokensAndCall([khalaToken, 300], ['withDrawAndCall', Nexus, [300, KhalaniERC20, 0x123124124])


    - Nexus.depositTokensAndCall(300, ['withDra

- what's nexus?
  - fortified (by Khala Chain consensus) AMP
  - 


Nexus
  on Ethereum, Avax, BSC...

  - depositTokenAndCall() ---- this is on Etheruem, BSC (other chains)
    - if PAN tokens (pan, panETH, panBTC, ... .)
      - burn the tokens and mint on the other side
    - else
      - lock tokens and mint on the other side
  - onWithdrawTokensAndCall()
    - if PAN tokens
      - mint the tokens and call
    - if other tokens
      - unlocks and tokens and call(0

  on Khala Chain:

  - withdrawTokensAndCall() --- this funciton only exist / can be called on Khala
    - always burn the tokens
  - onDepositTokensAndCall()
    - always mint the tokens




AXON CHAIN

- NexusInbox
  - receives addReserve(hadoukenContractAddress, USDC)
    - calls HadoukenInbox.addReserve()


  - receives addLiquidity()
    - mints USDCeth and PAN
    - onward to another contract call

  - relayers call function handle(KhalanContractAddress, ['onReceivePan', payload], chainId)

- HadoukenInbox
  - addReserve()

- KhalaniInbox
  - onReceivePan() only callable by Nexus
    - mintToAddress()
  - mint()


- Vortex
    - tradeAndWithdraw(inputToken, outputToken, destinationChainId)
      - Balancer.swapExactTokenFor...(inputToken, outputToken, slippage....,.)
      - Nexus.withdrawAndCall(outputToken, avax, 'transfer', user address)
    - trade
    - addLiquidity
    - withDrawLiquidity
      - Balancer.withDrawLiquidity()
      - Nexus.withdrawAndCall(outputToken, sourceChain, 'transfer', user address)


- Hadouken
  - Khalani.mint(400)

- ScamProject
  - Khalani.mint(400)




SAM's suggestion:


Ethereum 

Vortex
  - lock USDC
  - proof = Khalani.burnAndReturnProof(400);
  - Nexus.sendMessage('addLiquidity', payload, token_address, proof)



Khala:

Nexus
  - Nexus receives the mssage
  - validProof = Khalani.mintWithProof(400, proof)
  - process the contract call (addLiquidity)
    - the contract call mints USDC
    - 

  - 



