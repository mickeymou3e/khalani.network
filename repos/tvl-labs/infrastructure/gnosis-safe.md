# Gnosis Safe

Gnosis Safe has been deployed to Khalani Testnet, Godwoken Testnet and Godwoken Mainnet. On Godwoken Testnet and Mainnet it is using deterministic contract addresses thanks to safe-singleton-factory deployed on these chains by the Gnosis Safe maintainers. On Khalani the factory has been deployed by TVL team. The Safe is used by the Hadouken team to govern the Hadouken protocol.

- Frontend: https://safe-ui.khalani.network
- Config service: https://safe-cfg.khalani.network/
- Safe deployments: https://github.com/kuzirashi/safe-deployments/tree/feat/axon-testnet
- Safe transaction service: https://github.com/kuzirashi/safe-transaction-service/tree/feat/axon-testnet

Safe deployment is part of the Terraform and Helm files found in this repository. It is best to consult Helm templates to check the latest images used in the deployments.

Hadouken Safes:

Godwoken v0: 0x49c11CB0cDDEf9c3751a2681dBF4c8974aC35D0D
Godwoken v1 new: 0x7b761E6f5C129544a6663Bcb8741940604A65AF3