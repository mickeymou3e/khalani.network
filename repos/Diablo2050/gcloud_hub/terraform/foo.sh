#!/bin/bash

# Specify your zone
zone=us-central1-a

# Get the list of pods and nodes
pods=$(kubectl get pods --all-namespaces -o jsonpath="{range .items[*]}{'\n'}{.metadata.name}{','}{.spec.nodeName}{end}")

# Loop over the pods and nodes
while IFS=',' read -r pod_name node_name
do
  # Get the machine type of the node
  machine_type=$(gcloud compute instances describe $node_name --zone=$zone --format="value(machineType)")

  # Print the pod name, node name, and machine type
  echo "Pod: $pod_name, Node: $node_name, Machine Type: $machine_type"
done <<< "$pods"