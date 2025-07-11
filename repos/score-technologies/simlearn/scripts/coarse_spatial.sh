#!/bin/bash

mkdir -p outputs/coarse_spatial/training_evolution

python -m simlearn.train --config configs/coarse_spatial.yaml 