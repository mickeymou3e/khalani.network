#!/bin/bash


# TODO: Implement logic to skip downloading if the wheel already is present
pip3 download -d ./ezkl_wheels ezkl==1.11.5
pip3 download -d ./ezkl_wheels ezkl==1.12.3
pip3 download -d ./ezkl_wheels ezkl==1.12.8
pip3 download -d ./ezkl_wheels ezkl==1.13.2
pip3 download -d ./ezkl_wheels ezkl==1.16.0
pip3 download -d ./ezkl_wheels ezkl==1.17.2
pip3 download -d ./ezkl_wheels ezkl==1.18.0
pip3 download -d ./ezkl_wheels ezkl==1.19.2
pip3 download -d ./ezkl_wheels ezkl==1.21.1
pip3 download -d ./ezkl_wheels ezkl==1.22.1
pip3 download -d ./ezkl_wheels ezkl==1.24.0
pip3 download -d ./ezkl_wheels ezkl==1.25.0
pip3 download -d ./ezkl_wheels ezkl==1.27.0
pip3 download -d ./ezkl_wheels ezkl==2.5.0

for file in ./ezkl_wheels/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        version=$(echo "$filename" | grep -o -E 'ezkl-[0-9]+\.[0-9]+\.[0-9]+' | tr '.' '_' | tr '-' '_')
        existing_folder="./ezkl_wheels/${version}"

        if [ ! -d "$existing_folder" ]; then
            echo "$file"
            wheel unpack "$file" --dest "./ezkl_wheels"
            echo "Unpacked: $file"
        else
            echo "Skipped unpacking: $file (Folder already exists)"
        fi
    fi
done

# Loop through the folders in the source directory
for folder in ./ezkl_wheels/*; do
    if [ -d "$folder" ]; then
        # Extract the version string from the folder name
        version=$(basename "$folder" | sed 's/ezkl-\(.*\)/\1/' | tr '.' '_')

        if [[ "$version" != ezkl_* && "$version" != __pycache__ ]]; then
            # Create the new folder name
            new_folder_name="ezkl_${version}"

            # Rename the folder
            mv "$folder" "./ezkl_wheels/$new_folder_name"

            echo "Renamed: $folder -> $new_folder_name"
        else
            echo "Skipped renaming: $folder"
        fi
    fi
done