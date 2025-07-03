import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';

const GraphQLClientConfigInject = Symbol('GraphQLClientConfigInject');

export const GodwokenGraphqlInjection = Symbol('godwoken-graphql');

export const ZkSyncGraphqlInjection = Symbol('zksync-graphql');

export const MantleGraphqlInjection = Symbol('mantle-graphql');

type GraphQLClientConstructorParams = ConstructorParameters<
  typeof GraphQLClient
>;

export interface GraphQLRequestModuleConfig {
  endpoint: GraphQLClientConstructorParams[0];
  options?: GraphQLClientConstructorParams[1];
}

const createClient = (
  configService: ConfigService,
  chainName: string,
): GraphQLClient => {
  const environment = configService.get<string>('environment');

  const endpoint = configService.get<string>(
    `chains.${environment}.${chainName}.subgraph`,
  );

  const options: GraphQLRequestModuleConfig['options'] = {
    headers: {
      'content-type': 'application/json',
    },
  };

  return new GraphQLClient(endpoint, options);
};

@Module({})
export class GraphQLModuleGodwoken extends createConfigurableDynamicRootModule<
  GraphQLModuleGodwoken,
  GraphQLRequestModuleConfig
>(GraphQLClientConfigInject, {
  providers: [
    {
      provide: GodwokenGraphqlInjection,
      useFactory: (configService: ConfigService) => {
        return createClient(configService, 'godwoken');
      },
      inject: [ConfigService],
    },
  ],
  exports: [GodwokenGraphqlInjection],
}) {}

@Module({})
export class GraphQLModuleMantle extends createConfigurableDynamicRootModule<
  GraphQLModuleMantle,
  GraphQLRequestModuleConfig
>(GraphQLClientConfigInject, {
  providers: [
    {
      provide: MantleGraphqlInjection,
      useFactory: (configService: ConfigService) => {
        return createClient(configService, 'mantle');
      },
      inject: [ConfigService],
    },
  ],
  exports: [MantleGraphqlInjection],
}) {}

@Module({})
export class GraphQLModuleZkSync extends createConfigurableDynamicRootModule<
  GraphQLModuleZkSync,
  GraphQLRequestModuleConfig
>(GraphQLClientConfigInject, {
  providers: [
    {
      provide: ZkSyncGraphqlInjection,
      useFactory: (configService: ConfigService) => {
        return createClient(configService, 'zksync');
      },
      inject: [ConfigService],
    },
  ],
  exports: [ZkSyncGraphqlInjection],
}) {}
