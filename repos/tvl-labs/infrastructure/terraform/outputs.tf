output "axon_address_info" {
  value = module.axon-address.address_info
}

output "bank_info" {
  description = "Information about the bank, including their IAM roles, KMS keys"
  value       = module.bank.bank_info
}

output "funding_bot_role_arn_info" {
  description = "ARN role of the funding-bot role"
  value       = module.funding-bot.funding_bot_role_arn
}

output "deployer_info" {
  description = "Information about the Deployer including KMS key"
  value       = module.deployer.deployer_info
}

output "faucet_key_id" {
  description = "Faucet KMS key id"
  value       = module.faucet.faucet_key_id
}

output "hyperlane_relayer_info" {
  description = "The ARNs of the Relayers IAM Roles, and their corresponding KMS Keys and Aliases"
  value       = module.hyperlane-relayers.relayer_info
}

output "hyperlane_validator_info" {
  description = "Information about the Khalani validators, including their IAM roles, KMS keys, and S3 buckets"
  value       = module.hyperlane-validator.validator_info
}

output "hyperlane_godwoken_validator_info" {
  description = "Information about the Godwoken Validators, including their IAM roles, KMS keys, and S3 buckets"
  value       = module.hyperlane-godwoken-validator.validator_info
}


output "frontend_deployer_iam_user" {
  value = module.frontend.deployer_iam_user
}

output "frontend_environments_info" {
  value = module.frontend.applications_with_environments_info
}


output "khalani_solver_info" {
  value = module.solvers.solver_info
}


output "blockscout_info" {
  value       = module.blockscout.block_scout_info
}
