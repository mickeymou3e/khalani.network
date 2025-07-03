output "funding_bot_role_arn" {
  value = aws_iam_role.funding_bot.arn
  description = "The ARN of the funding-bot role"
}
