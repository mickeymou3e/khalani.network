# Setup multichain local developer network

Ensure you have the hyperlane cli installed.
1. Run `cast wallet new` to create a deployer account
2. Set `DEPLOYER_ADDRESS` and `DEPLOYER_KEY` environment variables based on the above output from cast

## For each chain (starting with arcadia):
3. Navigate to `src/dev_net/chains/hub` (for arcadia; for spoke1, navigate to `src/dev_net/chains/spoke1`; for spoke2, navigate to `src/dev_net/chains/spoke2`)
3. Run `hyperlane registry init` to create hyperlane registry. Do this three times, once for "arcadia", "spoke1", and "spoke2"
4. Run `cargo run --bin medusa-dev-net registry view ChainName` to get the hyperlane config information for chainName (either arcadia, spoke1, or spoke2).
5. Copy the port number associated with the rpc url output to the terminal.
6. In a separate terminal, run `anvil -p <PortNumberFromStep5> --chain-id <ChainIdYouSetWhenCreatingRegistry>`. **Keep this terminal open and anvil running**
7. Then in the original terminal, run:
```
cast send $DEPLOYER_ADDRESS --rpc-url 127.0.0.1:8545 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
--value $(cast tw 2)
```
Making sure that the `--rpc-url` matches the one output during step 4.

8. Verify the balance of the deployer account: `cast balance --rpc-url 127.0.0.1:8545 $DEPLOYER_ADDRESS` (it should be `2000000000000000000`)
9. Then run `hyplerlane core init` to initialize core deployment configuration for arcadia
10. To check that the configuration and environment is set correctly, run:
```
HYP_KEY=$DEPLOYER_KEY hyperlane core deploy --chain arcadia --registry ~/.hyperlane
```

Follow the instructions, selecting `Testnet` as the chain type and then selecting `ChainName` from the list of available testnet chains (either arcadia, spoke1, or spoke2).

11. `cat ~/.hyperlane/chains/arcadia/addresses.yaml`
12. Copy the mailbox address from the output above
13. Run `hyperlane core read --mailbox <MailboxAddressYouCopied> --chain <chainName> --registry ~/.hyperlane` (chainName would be arcadia, spoke1, or spoke2)
14. Within the output, you should see this section:
```
defaultHook:
  address: "0xHookAddress"
  type: merkleTreeHook
```
15. Copy the defaultHook address from the output above and add it to `~/.hyperlane/chains/arcadia/addresses.yaml`:
```
... addresses file contents ...
merkleTreeHook: "0xHookAddress"
```
### After the above steps
You should have three instances of anvil running for hub (arcadia), spoke1, and spoke 2.

16. Run `hyperlane registry agent-config --chains arcadia`

Note: To retry from scratch, shut down the anvil instance, delete the `./configs` directory and delete the `~/.hyperlane` directory.
