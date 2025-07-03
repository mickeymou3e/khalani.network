## Scripts for forwarding port from EKS running services to the host
_Prerequisite_: connect to the EKS cluster following instructions in the [aws-permissions.md](..%2F..%2Faws-permissions.md)

Run these scripts in separate terminals. Refresh the automatically opened page. 

### Prometheus
[forward-port-prometheus.sh](forward-port-prometheus.sh)

### Grafana
[forward-port-grafana.sh](forward-port-grafana.sh)

### Alertmanager
[forward-port-alertmanager.sh](forward-port-alertmanager.sh)