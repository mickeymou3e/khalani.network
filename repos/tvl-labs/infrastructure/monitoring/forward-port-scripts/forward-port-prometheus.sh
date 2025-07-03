# Forward Prometheus UI from the EKS cluster to the localhost.

# Page refresh is needed.
open http://localhost:59090
kubectl port-forward service/prometheus-operated -n monitoring 59090:9090