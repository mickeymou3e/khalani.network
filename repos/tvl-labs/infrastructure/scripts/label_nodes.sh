#!/bin/bash

nodes=( $(kubectl get nodes -o jsonpath='{.items[*].metadata.name}') )

for ((i=0; i<${#nodes[@]} && i<4; i++))
do
  kubectl label nodes ${nodes[$i]} node_name=node_$((i+1))
done
