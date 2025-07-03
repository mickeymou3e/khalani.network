import React from 'react'

import { IEntity } from '@components/TokenPaper/TokenPaper.types'
import { IToken } from '@interfaces/token'

export interface ISvg {
  height?: number
  width?: number
  fill?: string
}

export interface ISvgRenderer {
  icon: React.FC<ISvg> //(props: any) => JSX.Element
}

export interface IEntityWithIconComponent extends IEntity, ISvgRenderer {}

export interface ITokenPaperListProps {
  selectedTokenId?: string
  operationName: string
  description: string
  percentage: number
  tokens: IToken[]
  onChange?: (id: string) => void
}
