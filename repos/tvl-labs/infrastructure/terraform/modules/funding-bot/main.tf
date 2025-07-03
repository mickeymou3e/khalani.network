resource "aws_iam_role" "funding_bot" {
  name               = "funding-bot"
  assume_role_policy = templatefile("${path.module}/iam/funding-bot-role-trust-policy.json", {
    account_id      = var.account_id,
    service_account = "system:serviceaccount:applications:funding-bot",
    oidc_url         = var.oidc_url
  })
}