# Forward Alertmanager UI from the EKS cluster to the localhost.

# Page refresh is needed.
open http://localhost:59093
kubectl port-forward service/alertmanager-operated -n monitoring 59093:9093