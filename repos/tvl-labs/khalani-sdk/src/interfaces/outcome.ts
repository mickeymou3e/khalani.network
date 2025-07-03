export enum OutcomeAssetStructure {
  AnySingle,
  Any,
  All,
}

export enum FillStructure {
  Exact,
  Minimum,
  PercentageFilled,
  ConcreteRange,
}

export interface Outcome {
  mTokens: string[]
  mAmounts: bigint[]
  outcomeAssetStructure: OutcomeAssetStructure
  fillStructure: FillStructure
}

export function mapOutcomeAssetStructure(value: OutcomeAssetStructure): string {
  switch (value) {
    case OutcomeAssetStructure.AnySingle:
      return 'AnySingle'
    case OutcomeAssetStructure.Any:
      return 'Any'
    case OutcomeAssetStructure.All:
      return 'All'
    default:
      throw new Error(`Unknown OutcomeAssetStructure value: ${value}`)
  }
}

export function mapFillStructure(value: FillStructure): string {
  switch (value) {
    case FillStructure.Exact:
      return 'Exact'
    case FillStructure.Minimum:
      return 'Minimum'
    case FillStructure.PercentageFilled:
      return 'PercentageFilled'
    case FillStructure.ConcreteRange:
      return 'ConcreteRange'
    default:
      throw new Error(`Unknown FillStructure value: ${value}`)
  }
}

// Reverse mappings from string to enum (number)
export function reverseMapOutcomeAssetStructure(
  value: string,
): OutcomeAssetStructure {
  switch (value) {
    case 'AnySingle':
      return OutcomeAssetStructure.AnySingle
    case 'Any':
      return OutcomeAssetStructure.Any
    case 'All':
      return OutcomeAssetStructure.All
    default:
      throw new Error(`Unknown OutcomeAssetStructure string: ${value}`)
  }
}

export function reverseMapFillStructure(value: string): FillStructure {
  switch (value) {
    case 'Exact':
      return FillStructure.Exact
    case 'Minimum':
      return FillStructure.Minimum
    case 'PercentageFilled':
      return FillStructure.PercentageFilled
    case 'ConcreteRange':
      return FillStructure.ConcreteRange
    default:
      throw new Error(`Unknown FillStructure string: ${value}`)
  }
}
