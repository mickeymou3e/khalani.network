#!/bin/bash

# Save version
version=$(jq -r .version package.json)

npm unpublish @tvl-labs/sdk@0.1.1-snapshot --registry http://localhost:4873/
yarn publish --registry http://localhost:4873/ --new-version 0.1.1-snapshot --no-git-tag-version

# Restore version
jq ".version=\"$version\"" package.json > package.json.temp && mv package.json.temp package.json