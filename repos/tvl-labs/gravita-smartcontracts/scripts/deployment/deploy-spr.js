const SprDeploymentHelper = require("../utils/deploymentHelper-Spr.js")
const { Deployer } = require("./deployer-common.js")

/**
 * Exported deployment script, invoked from hardhat tasks defined on hardhat.config.js
 */
class SprDeployer extends Deployer {
	helper
	coreContracts
	SprContracts
	deploymentState

	constructor(hre, targetNetwork) {
		super(hre, targetNetwork)
		this.helper = new SprDeploymentHelper(this.hre, this.config, this.deployerWallet)
		this.deploymentState = this.helper.loadPreviousDeployment()
	}

	async run() {
		console.log(`Deploying Gravita SPR on ${this.targetNetwork}...`)

		await this.printDeployerBalance()

		// SprContracts = await helper.deploySprContracts(TREASURY_WALLET, deploymentState)
		// await deployOnlySPRContracts()
		// await helper.connectSprContractsToCore(SprContracts, coreContracts, TREASURY_WALLET)
		// await approveSPRTokenAllowanceForCommunityIssuance()
		// await this.transferSprContractsOwnerships()

		this.helper.saveDeployment(this.deploymentState)

		await this.transferContractsOwnerships(this.coreContracts)

		await this.printDeployerBalance()
	}

	async deployOnlySPRContracts() {
		console.log("INIT SPR ONLY")
		const partialContracts = await helper.deployPartially(TREASURY_WALLET, deploymentState)
		// create vesting rule to beneficiaries
		console.log("Beneficiaries")
		if (
			(await partialContracts.SPRToken.allowance(deployerWallet.address, partialContracts.lockedSpr.address)) == 0
		) {
			await partialContracts.SPRToken.approve(partialContracts.lockedSpr.address, ethers.MaxUint256)
		}
		for (const [wallet, amount] of Object.entries(config.SPR_BENEFICIARIES)) {
			if (amount == 0) continue
			if (!(await partialContracts.lockedSpr.isEntityExits(wallet))) {
				console.log("Beneficiary: %s for %s", wallet, amount)
				const txReceipt = await helper.sendAndWaitForTransaction(
					partialContracts.lockedSpr.addEntityVesting(wallet, amount.concat("0".repeat(18)))
				)
				deploymentState[wallet] = {
					amount: amount,
					txHash: txReceipt.transactionHash,
				}
				helper.saveDeployment(deploymentState)
			}
		}
		await transferOwnership(partialContracts.lockedSpr, TREASURY_WALLET)
		const balance = await partialContracts.SPRToken.balanceOf(deployerWallet.address)
		console.log(`Sending ${balance} SPR to ${TREASURY_WALLET}`)
		await partialContracts.SPRToken.transfer(TREASURY_WALLET, balance)
		console.log(`deployerETHBalance after: ${await ethers.provider.getBalance(deployerWallet.address)}`)
	}

	async approveSPRTokenAllowanceForCommunityIssuance() {
		const allowance = await SprContracts.SPRToken.allowance(
			deployerWallet.address,
			SprContracts.communityIssuance.address
		)
		if (allowance == 0) {
			await SprContracts.SPRToken.approve(SprContracts.communityIssuance.address, ethers.MaxUint256)
		}
	}
}

module.exports = CoreDeployer
