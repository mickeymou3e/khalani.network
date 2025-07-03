export interface StepperProps {
  steps: Step[]
}

export interface Step {
  id: number
  status: StepStatus
}

export enum StepStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  PENDING = 'pending',
  COMPLETED = 'completed',
}
