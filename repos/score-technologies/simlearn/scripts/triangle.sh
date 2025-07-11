#!/bin/bash

mkdir -p outputs/triangle/training_evolution

# Train the triangle model
python -m simlearn.train --config configs/triangle.yaml 