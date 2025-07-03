Khala Chain
  - An EVM compatible sidechain

Nexus
  - A cross chain messaging protocol that requires at least 2 factors to validate any cross chain messages
  - Nexus should speak the language / abstraction of channels and messages.
  - Message needs to have an ID of which Adapter / App-Inbox it needs to be sent to
  - it should be clear of application specific logic

Khalani
  - A cross-chain native stable coin $PAN.
  - $PAN's initial minting and redemption are on Ethereum
  - $PAN should be able to be transferred from any Chain A to Chain B THROUGH KHALA (why? because then we can double validate all $PAN tranfers)
  - On Ethereum, Khalani cares about of minting and redemption
  - On Khala, Khalani cares about minting and burning as part of cross chain transfers
  - User transfers PAN from Ethereum to Khala
    - Khalani contract on Ethereum burns PAN and pass a message of "mint and send to address X" to Khala chain
    - this messge gets passes to Khala Chain through Nexus
    - Khalani's Adapter/Inbox contract on Khala Chain interprets/decodes the message, and mints $PAN and send to an address

Vortex
  - A cross-chain liquidity protocol using $PAN as the bridging assets for all stable coins.
  - User provides liquidity of USDC and PAN
    - Vortex uses Khalani to send PAN from Ethereum to Khala Chain (the burn and mint and send to a contract that Vortex controls)
    - It itself locks USDC and mints USDC.eth (minted by Vortex) on Khala thorugh its own adapter
    - Balancer belongs to Vortex



Ethereum
    Celer  (external)
      - inbox
    Hyperlane (externL)
      - inbox

    Nexus
      - configuration on Ethereum: I'm using Hyperlane + Celer
      - function sendThroughAMB1()
      - function sendThroughAMB2()
      - function receveFromAMB1()
      - function receveFromAMB2()
      - function aggregateOneAndTwoAndValidate()

    Khalani
      - Furnace ($PAN)
      - Forge ($PAN)
      - Khalani Outbox
        - configures to use Nexus
        - send the message through Nexus

      - function: transfer to Khala
        - burns 100 $PAN
        - pass the message of "mints 100 PAN to Khala"
        - encode it and send it to Khalani Outbox


    Vortex
      - if user wants to give $PAN and $USDC to provide liquidity on Vortex on Khala
      - 


Khala Chain
    Khalani
      - Furnace
      - Inbox
        - turn an encoded payload into Forge.mintPanAndSendToAddress(100, 0x...)
      - Forge
        - mintPanAndSendToAddress(100)

    Vortex
      - provideLP
      - withdrawLP
      - Trade
      - adminFunc
