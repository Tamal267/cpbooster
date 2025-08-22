#!/bin/bash

# CPBooster Enhanced - Complete Installation Script for Ubuntu
# This script handles everything needed for a fresh Ubuntu setup

set -e

echo "🚀 CPBooster Enhanced Installation"
echo "==================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check and install Node.js
if ! command_exists node; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Check and install build tools
echo "🔧 Installing build tools..."
sudo apt-get update
sudo apt-get install -y build-essential git g++

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the cpbooster/app directory"
    echo "   git clone https://github.com/Tamal267/cpbooster.git"
    echo "   cd cpbooster/app"
    echo "   ./scripts/complete-install.sh"
    exit 1
fi

echo ""
echo "📁 Setting up CPBooster..."

# Install npm dependencies
echo "📦 Installing dependencies..."
npm install

# Build and setup
echo "🔨 Building and installing..."
npm run setup

echo ""
echo "🧪 Final verification..."

# Test the installation works
if cpb --version > /dev/null 2>&1; then
    echo "✅ Installation successful!"
    echo "   CPBooster version: $(cpb --version)"
    echo ""
    echo "📝 Your setup:"
    echo "   📂 Contest directory: ~/ccode"
    echo "   📄 Template: ~/ccode/algo/temp.cc"
    echo "   🐛 Debug file: ~/ccode/mydebug.h"
    echo ""
    echo "🎯 Usage:"
    echo "   cpb clone          # Start server for Competitive Companion"
    echo "   cpb test A.cpp     # Test your solution"
    echo "   cpb create B.cpp   # Create file with template"
    echo ""
    echo "🌐 Next steps:"
    echo "   1. Install Competitive Companion browser extension"
    echo "   2. Run 'cpb clone' to start the server"
    echo "   3. Open a contest and click the extension icon"
else
    echo "❌ Installation verification failed"
    echo "🔧 Trying to fix permissions..."
    ./scripts/fix-permissions.sh
    
    if cpb --version > /dev/null 2>&1; then
        echo "✅ Fixed! CPBooster is now working."
    else
        echo "❌ Still having issues. Please check the troubleshooting guide."
    fi
fi

echo ""
echo "🎉 Setup complete! Happy coding! 🚀"
