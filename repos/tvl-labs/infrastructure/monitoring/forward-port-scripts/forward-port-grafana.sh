# Forward Grafana UI from the EKS cluster to the localhost.

# Page refresh is needed.
open http://localhost:50080
kubectl port-forward service/prometheus-stack-grafana -n monitoring 50080:80