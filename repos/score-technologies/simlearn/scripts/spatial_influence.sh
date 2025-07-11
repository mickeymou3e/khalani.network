#!/bin/bash

# Create output directories if they don't exist
mkdir -p outputs/spatial_influence/training_evolution
mkdir -p outputs/spatial_influence/influence_maps

# Run training
python -m simlearn.train --config configs/spatial_influence.yaml 