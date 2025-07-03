import { CliProps } from "../../../types";

export interface PoolCliProps extends CliProps {
  poolName: string
}

export type PoolCli = (props: PoolCliProps) => Promise<void>