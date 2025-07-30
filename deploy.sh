#!/bin/bash

# PoolPass Deployment Script
# This script helps you deploy PoolPass to GitHub Pages

echo "🏊‍♂️ PoolPass Deployment Script"
echo "================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial PoolPass app commit"
    echo "✅ Git repository initialized"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🌐 Please enter your GitHub repository URL:"
    echo "   Example: https://github.com/YOUR_USERNAME/poolpass.git"
    read -p "Repository URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ No repository URL provided. Exiting."
        exit 1
    fi
    
    git remote add origin "$repo_url"
    echo "✅ Remote origin added"
fi

# Set main branch
git branch -M main

# Add all changes
echo "📝 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update PoolPass app $(date)"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click 'Settings' → 'Pages'"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://YOUR_USERNAME.github.io/REPOSITORY_NAME"
echo ""
echo "🔧 Don't forget to:"
echo "   - Change the default admin PIN (1234)"
echo "   - Update pool information in data/settings.json"
echo "   - Add your resident list to data/residents.json"
echo ""
echo "🎉 PoolPass is ready for your community pool!" 