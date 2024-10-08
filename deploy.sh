#!/bin/bash

echo " "
echo " "
echo " "

cd /var/www/hr-portal

echo " --- "
echo " --- "
echo " --- Pull the latest changes from the git repository"
git stash
git pull


echo  " --- Remove the old dist folder if it exists"
if [ -d "./dist" ]; then
    rm -rf ./dist
fi

echo " --- Extract the dist.tar.gz file"
tar -xzvf dist.tar.gz -C ./

sudo chmod +x deploy.sh

echo " --- Deployed successfully"
echo "cd /var/www/hr-portal"
echo "cd /var/www/hr-portal/dist/fuse/browser/"
