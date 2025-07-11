#!/bin/bash

# Create the folder if it doesn't exist
mkdir -p ./server/artifact/srs

# download powers of tau from k=1-26
for i in {1..26}; do
    new_filename="perpetual_powers_of_tau_${i}.srs"

    # only download if file doesn't exist already so we don't spam their s3
    if [ ! -f "./server/artifact/srs/${new_filename}" ]; then

        url="https://trusted-setup-halo2kzg.s3.eu-central-1.amazonaws.com/perpetual-powers-of-tau-raw-$i"

        # Download the file and save it in the artifacts folder
        wget -O "./server/artifact/srs/${new_filename}" "$url"
    else
        echo "File already exists at: ./server/artiface/srs/${new_filename}. Skipping download."
    fi
done