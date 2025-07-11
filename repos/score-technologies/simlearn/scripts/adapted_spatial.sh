#!/bin/bash

mkdir -p outputs/adapted_spatial/training_evolution

python -m simlearn.train --config configs/adapted_spatial.yaml 