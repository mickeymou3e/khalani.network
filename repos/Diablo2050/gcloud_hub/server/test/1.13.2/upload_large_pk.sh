#!/bin/bash

# take in cli arguments
# Initialize variables to store argument values
id=""
file=""
url=""

# Loop through the arguments using a while loop
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --id)
            id="$2"
            shift 2 # Shift 2 positions to skip the argument and its value
            ;;
        --file)
            file="$2"
            shift 2
            ;;
        --url)
            url="$2"
            shift 2
            ;;
        *)
            echo "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# split the pk
mkdir -p chunks
split -b 200M -a 3 -d "$file" "chunks/part"
echo "Split files into ./chunk"

# get the total number of files
total=$(ls -1 ./chunks | wc -l)

# for each pk part upload to the endpoint
for filepartpath in ./chunks/*; do
    filename=$(basename "$filepartpath")

    if [[ "$filename" =~ ^part[0-9]+$ ]]; then

        i="${filename#part}"  # Remove the 'part' prefix

        # Remove leading zeros
        i=$(echo "$i" | sed 's/^0*//')

        # increment i by 1
        i=$((10#$i + 1))

        # make curl request
        curl --request POST \
        --url "$url" \
        --header 'Content-Type: multipart/form-data' \
        --form "operations={
            \"query\": \"mutation(\$fileChunk: Upload!) { uploadArtifactFiles(id: \\\"$id\\\", uploadType: pk, chunkNumber: $i, chunkTotal: $total, fileChunk: \$fileChunk ) {id \\n pkUploaded \\n pkValidated}}\",
            \"variables\": { \"fileChunk\": null }
        }" \
        --form 'map={
            "fileChunk": [
            "variables.fileChunk"
            ]
        }' \
        --form fileChunk=@$filepartpath

        echo "  Uploaded chunk $i out of $total"

        # sleep to not spam the server
        sleep 1
    else
        echo "Skipping unrecognized file: $filename"
    fi
done

# delete chunks as we are done
rm -rf chunks