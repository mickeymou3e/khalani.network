export type Parameters = { [key: string]: string }

export interface StepDefinition {
  Type:
    | 'Pass'
    | 'Task'
    | 'Choice'
    | 'Wait'
    | 'Succeed'
    | 'Fail'
    | 'Parallel'
    | 'Map'
  Resource?: string
  Result?: unknown
  ResultPath?: string
  ResultSelector?: string
  Parameters?: Parameters
  Next?: string
  Default?: string
}
export interface StateMachineDefinition {
  States: { [name: string]: StepDefinition }
}
