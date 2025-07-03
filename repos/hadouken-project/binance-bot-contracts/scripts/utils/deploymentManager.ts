import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

export interface Deployment {
  deployer: string
  treasuryProxyAddress: string
  vaultAddress: string
}

export type Deployments = Record<string, Deployment>

export class DeploymentManager {
  public readonly deploymentFilePath: string
  private deploymentDraft: Deployments = {}

  constructor(deploymentFilePath: string) {
    this.deploymentFilePath = deploymentFilePath
  }

  read = async () => {
    try {
      const deploymentsFile = await readFile(this.deploymentFilePath)

      this.deploymentDraft = JSON.parse(deploymentsFile.toString())
    } catch {
      this.deploymentDraft = {}
    }

    return this.deploymentDraft
  }

  write = async (chainId: string | number, deployment: Deployment) => {
    const _chainId = chainId.toString()

    if (Object.keys(this.deploymentDraft).length === 0) await this.read()

    this.deploymentDraft[_chainId] = deployment

    await writeFile(this.deploymentFilePath, JSON.stringify(this.deploymentDraft))
  }
}

export const deploymentManager = new DeploymentManager(resolve(__dirname, "../../deployments/deployments.json"))
