#!/bin/bash

cd /var/www/hr-portal
echo "Pull the latest changes from the git repository"
git pull

echo  "Remove the old dist folder if it exists"
if [ -d "./dist" ]; then
    rm -rf ./dist
fi

echo "Extract the dist.tar.gz file"
tar -xzvf dist.tar.gz -C ./

echo "Deployed successfully"
echo "cd /var/www/hr-portal"
echo "cd /var/www/hr-portal/dist/fuse/browser/"/
