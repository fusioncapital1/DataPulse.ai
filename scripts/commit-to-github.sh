#!/bin/bash
# Script to commit the Firebase setup files to GitHub

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Navigate to the project root
cd "$(dirname "$0")/.." || exit

# Check if this is a git repository
if [ ! -d .git ]; then
    echo "This is not a git repository. Initializing..."
    git init
fi

# Add the files
git add scripts/setup-firebase.js
git add scripts/README.md
git add .gitignore
git add README.md

# Commit the changes
git commit -m "Add Firebase setup script and documentation"

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "No remote repository found."
    echo "To push to GitHub, run:"
    echo "git remote add origin https://github.com/fusioncapital1/DataPulse.ai.git"
    echo "git push -u origin main"
else
    echo "To push to GitHub, run:"
    echo "git push"
fi

echo "Firebase setup files committed successfully!"
