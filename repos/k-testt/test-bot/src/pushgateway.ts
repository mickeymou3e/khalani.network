import { Pushgateway, Registry } from 'prom-client';

/**
 * Push metrics accumulated in `metricsRegister` to the Prometheus Pushgateway service running on `prometheusPushgatewayUrl`.
 * `jobName` is the name of the current process pushing metrics, used to distinguish metrics.
 */
export async function pushPrometheusMetricsViaPushgateway(
  metricsRegister: Registry,
  prometheusPushgatewayUrl: string,
  jobName: string
) {
  const gateway = new Pushgateway(prometheusPushgatewayUrl, [], metricsRegister);
  const pushResponse = await gateway.push({ jobName });
  const response = pushResponse.resp;
  const statusCode =
    typeof response == 'object' && response != null && 'statusCode' in response
      ? (response as any).statusCode
      : 'unknown';
  if (statusCode !== 200 && statusCode !== 204) {
    throw new Error(`Failed to push Prometheus metrics via Pushgateway: ${JSON.stringify(pushResponse)}`);
  }
}