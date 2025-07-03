import * as StepFunctions from 'aws-sdk/clients/stepfunctions'
import waitForExpect from 'wait-for-expect'
import * as fs from 'fs'
import { yamlParse } from 'yaml-cfn'
import type { StateMachineDefinition } from './types'

export class StateMachineHelper {
  constructor(private stepFunctions: StepFunctions) {}

  async createOrUpdateStateMachine(
    definition: StateMachineDefinition,
    machineName: string,
    serviceRoleArn = 'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
  ): Promise<string> {
    const existingMachines = await this.stepFunctions
      .listStateMachines({})
      .promise()
    const needsToUpdate = existingMachines.stateMachines.find(
      (machine) => machine.name === machineName,
    )
    if (!needsToUpdate) {
      const stateMachine = await this.stepFunctions
        .createStateMachine({
          definition: JSON.stringify(definition),
          name: machineName,
          roleArn: serviceRoleArn,
        })
        .promise()
      return stateMachine.stateMachineArn
    } else {
      await this.stepFunctions
        .updateStateMachine({
          stateMachineArn: needsToUpdate?.stateMachineArn,
          definition: JSON.stringify(definition),
        })
        .promise()
      return needsToUpdate?.stateMachineArn
    }
  }

  async runAndWait(
    stateMachineArn: string,
    input: unknown,
    fixtureName = '',
    expectedState: StepFunctions.Types.ExecutionStatus = 'SUCCEEDED',
    timeout = 2000,
    interval = 200,
  ): Promise<ExecutionHistory> {
    const runResponse = await this.stepFunctions
      .startExecution({
        stateMachineArn: `${stateMachineArn}${
          fixtureName ? `#${fixtureName}` : ''
        }`,
        input: JSON.stringify(input),
      })
      .promise()
    await this.waitForExecutionToFinish(
      runResponse.executionArn,
      expectedState,
      timeout,
      interval,
    )
    const executionHistory = await this.stepFunctions
      .getExecutionHistory({
        executionArn: runResponse.executionArn,
      })
      .promise()

    return new ExecutionHistory(executionHistory.events)
  }

  private async waitForExecutionToFinish(
    executionArn: string,
    expectedState: StepFunctions.Types.ExecutionStatus = 'SUCCEEDED',
    timeout = 2000,
    interval = 200,
  ): Promise<void> {
    await waitForExpect(
      async () => {
        const state = await this.stepFunctions
          .describeExecution({
            executionArn: executionArn,
          })
          .promise()
        expect(state.status).toEqual(expectedState)
      },
      timeout,
      interval,
    )
  }
}

export class ExecutionHistory {
  constructor(public events: StepFunctions.HistoryEvent[]) {}

  getEnteredWaitedStatesName() {
    return this.events
      .filter((event) => event.type === 'WaitStateEntered')
      .map((event) => event.stateEnteredEventDetails.name)
  }

  getAllLambdaCalls() {
    return this.events
      .filter((event) => event.type === 'LambdaFunctionScheduled')
      .map((event) => ({
        ...event,
        parsedInput: this.parseLambdaScheduledInput(event),
        stateName: this.lookBackStateName(event),
      }))
  }

  getCallsTo(stateName: string) {
    return this.getAllLambdaCalls().filter(
      (call) => call.stateName === stateName,
    )
  }

  private parseLambdaScheduledInput(event: StepFunctions.HistoryEvent) {
    try {
      return JSON.parse(event.lambdaFunctionScheduledEventDetails!.input!)
    } catch {
      return null
    }
  }

  private lookBackStateName(event: StepFunctions.HistoryEvent) {
    return this.events
      .slice(0, event.id - 1)
      .reverse()
      .find((event) => event.type === 'TaskStateEntered')!
      .stateEnteredEventDetails!.name
  }
}

const identity = (x: StateMachineDefinition) => x

export function readStateMachineDefinition(
  templateFilePath: string,
  stateMachineResourceName: string,
  transform = identity,
) {
  const templateContent = fs.readFileSync(templateFilePath, 'utf8')
  const parsed = yamlParse(templateContent)
  const definition = parsed.Resources?.[stateMachineResourceName]
  if (!definition) {
    throw new Error(
      `Not found resource name ${stateMachineResourceName} in:\n${JSON.stringify(
        parsed,
        null,
        2,
      )}`,
    )
  }
  return transform(definition.Properties?.Definition)
}
