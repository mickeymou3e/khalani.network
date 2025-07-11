#!/bin/bash

mkdir -p outputs/shallow_spatial/training_evolution

python -m simlearn.train --config configs/shallow_spatial.yaml 