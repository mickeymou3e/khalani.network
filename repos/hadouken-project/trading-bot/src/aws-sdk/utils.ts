import * as SecretsManager from 'aws-sdk/clients/secretsmanager'

export const getSecret = async (secretArn: string, binance?: string) => {
  const region = binance === '1' ? 'eu-central-1' : 'us-east-1'

  const client = new SecretsManager({
    region: region,
  })

  const secretsString = await (
    await client.getSecretValue({ SecretId: secretArn }).promise()
  ).SecretString

  return JSON.parse(secretsString)
}
