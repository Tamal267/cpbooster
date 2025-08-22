#!/bin/bash

# CPBooster Enhanced Installation Script
# This script provides a complete setup for new Ubuntu systems

set -e

echo "🚀 CPBooster Enhanced Installation"
echo "==================================="
echo ""

# Color functions
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js already installed: $NODE_VERSION"
else
    error "Node.js not found. Please install Node.js first:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

# Install build tools
info "Installing build tools..."
sudo apt-get update -qq
sudo apt-get install -y build-essential git g++

echo ""
info "Setting up CPBooster..."

# Install dependencies and build
info "Installing dependencies..."
npm install --legacy-peer-deps

# Fix compilation issues by removing bogus require() calls
info "Fixing compilation artifacts..."
find dist -name "*.js" -exec sed -i '/^require();$/d' {} \; 2>/dev/null || true

# Build and setup
info "Building and installing..."
npm run setup

# Fix permissions
info "Fixing permissions..."
chmod +x dist/src/index.js

# Install globally with sudo (more reliable)
info "Installing globally..."
sudo npm install -g . 2>/dev/null || {
    warning "Global install failed, trying local setup..."
    
    # Create local bin directory
    mkdir -p "$HOME/bin"
    
    # Create symlink
    ln -sf "$(pwd)/dist/src/index.js" "$HOME/bin/cpb"
    ln -sf "$(pwd)/dist/src/index.js" "$HOME/bin/cpbooster"
    
    # Set permissions
    chmod +x "$HOME/bin/cpb" "$HOME/bin/cpbooster"
    
    success "Created local installation"
}

# Fix any remaining compilation issues
info "Final compilation fix..."
find dist -name "*.js" -exec sed -i '/^require();$/d' {} \; 2>/dev/null || true

# Add to PATH if needed
if ! echo $PATH | grep -q "$HOME/bin"; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc 2>/dev/null || true
    info "Added ~/bin to PATH in shell profiles"
fi

echo ""
success "Setup complete!"
echo "📝 Default configuration:"
echo "  - Contest directory: ~/ccode"
echo "  - Debug file: ~/ccode/mydebug.h (auto-copied to contests)"
echo "  - Template: ~/ccode/algo/temp.cc"
echo "  - No platform directories (flat structure)"
echo ""
echo "🚀 Usage:"
echo "  cpb clone    # Start server for Competitive Companion"
echo "  cpb test A.cpp   # Test your solution"
echo "  cpb create B.cpp # Create new file with template"
echo ""

# Test installation
info "Testing installation..."
export PATH="$HOME/bin:$PATH"

if command -v cpb &> /dev/null; then
    VERSION=$(cpb --version 2>/dev/null || echo "unknown")
    if [ "$VERSION" != "unknown" ]; then
        success "CPBooster v$VERSION installed successfully!"
    else
        warning "cpb command found but version check failed"
        error "There may be compilation issues. Try restarting your terminal."
    fi
else
    error "cpb command not found in PATH"
    echo "💡 Try running: export PATH=\"\$HOME/bin:\$PATH\""
    echo "💡 Or restart your terminal"
fi

echo ""
echo "🎉 Happy coding! 🚀"
