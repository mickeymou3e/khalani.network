import { BALANCER_NETWORK_CONFIG } from '@/lib/constants/config';
import { BalancerNetworkConfig, BalancerSdkConfig, Network } from '@/types';
export function getNetworkConfig(
  config: BalancerSdkConfig
): BalancerNetworkConfig {
  if (typeof config.network === 'number') {
    const networkConfig = BALANCER_NETWORK_CONFIG[config.network];

    return {
      ...networkConfig,
      urls: {
        ...networkConfig.urls,
        subgraph: config.customSubgraphUrl ?? networkConfig.urls.subgraph,
      },
      tenderly: config.tenderly,
      customLinearPools: config.customLinearPools,
    };
  }

  console.log({ urls: config.network });
  console.log({ config });

  return {
    ...config.network,
    urls: {
      ...config.network.urls,
      subgraph: config.customSubgraphUrl ?? config.network.urls.subgraph,
    },
    tenderly: config.network.tenderly,
    customLinearPools: config.network.customLinearPools,
  };
}
