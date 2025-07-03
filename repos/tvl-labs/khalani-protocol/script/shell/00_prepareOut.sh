#!/bin/bash

# Read deploy_config.json
deploy_config=$(cat ./script/config/deploy_config.json)

# Create networks.json and mirror_tokens.json if they do not exist
# Initialize them as empty JSON objects if they're empty
networks_file="./script/config/networks.json"
mirror_tokens_file="./script/config/mirror_tokens.json"
[[ ! -f $networks_file || ! -s $networks_file ]] && echo "{}" > $networks_file
[[ ! -f $mirror_tokens_file || ! -s $mirror_tokens_file ]] && echo "{}" > $mirror_tokens_file

# Read existing data in networks.json and mirror_tokens.json
networks=$(cat $networks_file)
mirror_tokens=$(cat $mirror_tokens_file)

# Add new chains from deploy_config.json to networks.json and mirror_tokens.json
for chain in $(echo "${deploy_config}" | jq -r 'keys[]'); do
  if ! echo "${networks}" | jq -e .${chain} > /dev/null 2>&1; then
    # Chain does not exist in networks.json, add it with empty string
    networks=$(echo "${networks}" | jq ". + {\"${chain}\": \"\"}")
  fi
  if ! echo "${mirror_tokens}" | jq -e .${chain} > /dev/null 2>&1; then
    # Chain does not exist in mirror_tokens.json, add it with empty object
    mirror_tokens=$(echo "${mirror_tokens}" | jq ". + {\"${chain}\": {}}")
  fi
done

# Write the updated networks and mirror_tokens back to their respective files
echo "${networks}" > $networks_file
echo "${mirror_tokens}" > $mirror_tokens_file
