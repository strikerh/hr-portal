#!/bin/bash

# Pull the latest changes from the git repository
git pull

# Remove the old dist folder if it exists
if [ -d "./dist" ]; then
    rm -rf ./dist
fi

# Extract the dist.tar.gz file
tar -xzvf dist.tar.gz -C ./
