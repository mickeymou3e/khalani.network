output "faucet_key_id" {
  description = "The ID of the faucet KMS key"
  value       = aws_kms_key.faucet.key_id
}
