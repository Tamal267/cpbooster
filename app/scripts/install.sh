#!/bin/bash

# CPBooster Enhanced Setup Script
# Works on Ubuntu without sudo npm issues

set -e

echo "🚀 CPBooster Enhanced Setup"
echo "==========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the app directory"
    echo "   cd cpbooster/app && ./scripts/install.sh"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Make the binary executable
chmod +x dist/src/index.js

# Run setup script
echo "⚙️  Running setup..."
node scripts/setup.js

echo ""
echo "✅ Installation complete!"
echo ""
echo "🧪 Testing installation..."

# Test the installation
if command -v cpb &> /dev/null; then
    echo "✅ cpb command available"
    cpb --version
elif [ -f "$HOME/bin/cpb" ]; then
    echo "✅ cpb available at ~/bin/cpb"
    echo "💡 Add to PATH: export PATH=\"\$HOME/bin:\$PATH\""
    "$HOME/bin/cpb" --version
else
    echo "❌ cpb not found. Manual installation required."
    exit 1
fi

echo ""
echo "🎉 Setup complete! Ready to use:"
echo "   cpb clone    # Start server"
echo "   cpb test A.cpp   # Test solution"
echo ""
