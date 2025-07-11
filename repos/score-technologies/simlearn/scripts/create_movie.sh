#!/bin/bash
MODEL_TYPE=$1
FPS=${2:-2}  # Default to 2 fps if not specified

if [ -z "$MODEL_TYPE" ]; then
    echo "Usage: ./scripts/create_movie.sh <model_type> [fps]"
    echo "Examples:"
    echo "  ./scripts/create_movie.sh simple"
    echo "  ./scripts/create_movie.sh full"
    echo "  ./scripts/create_movie.sh full 4"
    exit 1
fi

# Add imageio to requirements if not already present
pip install imageio[ffmpeg]

# Create the movie
python -m scripts.create_training_movie --model-type $MODEL_TYPE --fps $FPS 