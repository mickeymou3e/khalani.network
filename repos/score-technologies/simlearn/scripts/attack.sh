#!/bin/bash

mkdir -p outputs/attack/training_evolution

python -m simlearn.train --config configs/attack.yaml 