SOLVER_NAMESPACE := applications

.PHONY: install_all upgrade_all uninstall_all
install_all:   install_settler install_spoke_chain_caller install_intentbook_matchmaker
upgrade_all:   upgrade_settler upgrade_spoke_chain_caller upgrade_intentbook_matchmaker
uninstall_all:   uninstall_settler uninstall_spoke_chain_caller uninstall_intentbook_matchmaker

.PHONY: install_cross_chain_market_maker upgrade_cross_chain_market_maker uninstall_cross_chain_market_maker
install_cross_chain_market_maker:
	helm install cross-chain-market-maker ./cross-chain-market-maker --namespace $(SOLVER_NAMESPACE)
upgrade_cross_chain_market_maker:
	helm upgrade cross-chain-market-maker ./cross-chain-market-maker --namespace $(SOLVER_NAMESPACE)
uninstall_cross_chain_market_maker:
	helm uninstall cross-chain-market-maker --namespace $(SOLVER_NAMESPACE)

.PHONY: install_intentbook_matchmaker upgrade_intentbook_matchmaker uninstall_intentbook_matchmaker
install_intentbook_matchmaker:
	helm install intentbook-matchmaker ./intentbook-matchmaker --namespace $(SOLVER_NAMESPACE)
upgrade_intentbook_matchmaker:
	helm upgrade intentbook-matchmaker ./intentbook-matchmaker --namespace $(SOLVER_NAMESPACE)
uninstall_intentbook_matchmaker:
	helm uninstall intentbook-matchmaker --namespace $(SOLVER_NAMESPACE)

.PHONY: install_settler upgrade_settler uninstall_settler
install_settler:
	helm install settler ./settler --namespace $(SOLVER_NAMESPACE)
upgrade_settler:
	helm upgrade settler ./settler --namespace $(SOLVER_NAMESPACE)
uninstall_settler:
	helm uninstall settler --namespace $(SOLVER_NAMESPACE)

.PHONY: install_spoke_chain_caller upgrade_spoke_chain_caller uninstall_spoke_chain_caller
install_spoke_chain_caller:
	helm install spoke-chain-caller ./spoke-chain-caller --namespace $(SOLVER_NAMESPACE)
upgrade_spoke_chain_caller:
	helm upgrade spoke-chain-caller ./spoke-chain-caller --namespace $(SOLVER_NAMESPACE)
uninstall_spoke_chain_caller:
	helm uninstall spoke-chain-caller --namespace $(SOLVER_NAMESPACE)

.PHONY: install_secrets
install_secrets:
	helm install solver-secrets ./solver_secrets --namespace $(SOLVER_NAMESPACE)

.PHONY: uninstall_secrets
uninstall_secrets:
	helm uninstall solver-secrets  --namespace $(SOLVER_NAMESPACE)

.PHONY: upgrade_secrets
upgrade_secrets:
	helm upgrade solver-secrets ./solver_secrets --namespace $(SOLVER_NAMESPACE)