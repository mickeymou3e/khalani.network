# Monitoring
We run Prometheus/Grafana/Alertmanager services in the `monitoring` namespace of the EKS cluster.

We install [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm release,
which deploys [Prometheus Operator](https://prometheus-operator.dev/docs/operator/design/) and CRD (Custom Resource Definitions) 
`Prometheus`, `ServiceMonitor` to automate configuration and discovery of services.

```shell
# Given a fresh cluster
make install-prometheus-stack

# Given configurations of the stack has changed
make upgrade-prometheus-stack
```

### Discovery
For each `Service` in a namespace (e.g. `hyperlane`, `axon`) there is a corresponding `ServiceMonitor` object deployed to the `monitoring` namespace that selects
the services from that namespace. Each `ServiceMonitor` has its own label `metrics: "true"` that unifies the discovery by Prometheus Operator.

### Pushgateway
[Prometheus Pushgateway](https://prometheus.io/docs/instrumenting/pushing/) is a metric relayer that accepts metrics from short-lived jobs and forwards them to the main Prometheus instance.
We install the [Pushgateway Helm chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-pushgateway).

```shell
make install-prometheus-pushgateway
```

### How to add a new service to Prometheus
_Prerequisite:_ Service must have a corresponding `Service` object with a `metrics` port exposed. 

_Prerequisite:_ Service should have an app-specific label used by `ServiceMonitor` to select that service. Usually, Helm charts create
a convention template `{{ include "hyperlane-validators.selectorLabels" . | nident 4 }}` to select that service.

Then create a `servicemonitor.yaml` with a similar content, and make it part of the service's Helm chart or `kubectl apply -f` it as a standalone object:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ include "my-chart.fullname" . }} 
  # Always create in the 'monitoring' namespace
  namespace: monitoring
  # Convention label to unify the ServiceMonitor discovery.
  labels:
    metrics: "true"
spec:
  selector:
    matchLabels:
      {{- include "my-chart.selectorLabels" . | nindent 6 }}
  namespaceSelector:
    matchNames:
      - <namespace>
  endpoints:
    - port: metrics     # Port name exposed from the service
      path: /metrics    # HTTP path where Prometheus metrics are served
      honorLabels: true # To preserve original label names
```

### How to add a new alert rule
Create a `my-rule.yaml` with a similar content, and make it part of the service's Helm chart or `kubectl apply -f` it as a standalone object:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: <rule name>
  # Always create in the 'monitoring' namespace
  namespace: monitoring
  # Convention label to unify the PrometheusRule discovery.
  labels:
    rules: "true"
spec:
  groups:
    - name: <group name>
      rules:
        - alert: SomeMetricBelowThreshold
          expr: some_metric{some_value="value"} < 0.3
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "Some metric is below 0.3"
            description: "The current metric value is {{`{{`}} $value {{`}}`}}."
```