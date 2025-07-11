## How to approve as a sudo-er
Only the *first* signer needs to run the approval script. 
This will create the approval multi-sig transaction that can be sent
to the other signers for approval via usual PolkadotJS Apps (Oracle).

Requires:
- call data from CI as a file containing a hex-string
- your mnemonic

```
yarn (samvps|prod)-approval wss://<endpoint>:443 <CI_key_address> 0 <block> <index> <CI_call_data> "<mnemonic>"
```
Then, share the outputted file `deployment-multisig-proposal.hex` to the other signers.