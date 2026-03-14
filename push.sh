#!/bin/bash 

echo "Running build..."
if npm run build; then
    date=$(date)
    git add .
    git commit -m "update $date"
    git push
else
    echo "Build failed. Aborting."
    exit 1
fi