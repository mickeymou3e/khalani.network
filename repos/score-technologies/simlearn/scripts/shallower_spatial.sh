#!/bin/bash

mkdir -p outputs/shallower_spatial/training_evolution

python -m simlearn.train --config configs/shallower_spatial.yaml 