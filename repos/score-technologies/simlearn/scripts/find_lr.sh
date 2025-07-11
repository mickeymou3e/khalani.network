#!/bin/bash

# Directory for temporary config files
TMP_DIR="tmp_configs"
mkdir -p $TMP_DIR

# Function to create temporary config with modified batch size
create_temp_config() {
    local original_config=$1
    local batch_size=$2
    local output_file="${TMP_DIR}/temp_config_${batch_size}.yaml"
    
    # Copy original config and modify batch size
    cp "$original_config" "$output_file"
    sed -i '' "s/batch_size: .*/batch_size: $batch_size/" "$output_file"
    
    echo "$output_file"
}

# Test different batch sizes for learning rate finding
BATCH_SIZES=(256 512 1024 2048)

# Function to run learning rate finder for a model
run_lr_finder() {
    MODEL=$1
    echo "Testing ${MODEL}..."
    
    for BS in "${BATCH_SIZES[@]}"; do
        echo "Running with batch size: ${BS}"
        CONFIG="configs/${MODEL}.yaml"  # Updated: removed _model
        python find_lr.py --config $CONFIG --batch-size $BS
        
        # Move the output file to include batch size in name
        mv outputs/lr_finder.png "outputs/${MODEL}/lr_finder/lr_finder_bs${BS}.png"
        echo "Results saved to outputs/${MODEL}/lr_finder/lr_finder_bs${BS}.png"
        echo "----------------------------------------"
    done
}

# Create output directories
mkdir -p outputs/simple/lr_finder
mkdir -p outputs/full/lr_finder
mkdir -p outputs/ball_anticipation/lr_finder

# Run for each model
run_lr_finder "simple"
run_lr_finder "full"
run_lr_finder "ball_anticipation"

# Cleanup temporary configs
rm -rf $TMP_DIR

echo "Learning rate search completed for all configurations!" 