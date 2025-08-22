#!/bin/bash

# Quick fix script for CPBooster permission issues

echo "🔧 Fixing CPBooster permissions..."

# Fix the global installation permissions
if [ -f "/usr/lib/node_modules/cpbooster/dist/src/index.js" ]; then
    sudo chmod +x /usr/lib/node_modules/cpbooster/dist/src/index.js
    echo "✅ Fixed global installation permissions"
else
    echo "❌ Global installation not found"
fi

# Test if cpb works now
if cpb --version > /dev/null 2>&1; then
    echo "✅ cpb command is working!"
    cpb --version
else
    echo "❌ cpb still not working, trying alternative setup..."
    
    # Create local bin directory and symlink
    mkdir -p ~/bin
    
    # Find the cpbooster installation
    if [ -f "/usr/lib/node_modules/cpbooster/dist/src/index.js" ]; then
        ln -sf /usr/lib/node_modules/cpbooster/dist/src/index.js ~/bin/cpb
        chmod +x ~/bin/cpb
        echo "✅ Created local symlink at ~/bin/cpb"
        echo "💡 Add to your shell profile: export PATH=\"\$HOME/bin:\$PATH\""
        
        # Add to current session
        export PATH="$HOME/bin:$PATH"
        
        if cpb --version > /dev/null 2>&1; then
            echo "✅ cpb command now working!"
            cpb --version
        fi
    else
        echo "❌ Could not find cpbooster installation"
    fi
fi

echo ""
echo "🎯 If cpb still doesn't work, run:"
echo "   export PATH=\"\$HOME/bin:\$PATH\""
echo "   cpb --version"
