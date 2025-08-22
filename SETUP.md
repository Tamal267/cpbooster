# CPBooster Enhanced Setup

## 🚀 One-Command Setup for Ubuntu

### Prerequisites & Installation

```bash
# Complete setup (includes Node.js, build tools, and CPBooster)
git clone https://github.com/Tamal267/cpbooster.git
cd cpbooster/app
./scripts/complete-install.sh
```

**Alternative (if you have Node.js already):**

```bash
# Clone and setup
git clone https://github.com/Tamal267/cpbooster.git
cd cpbooster/app
npm install
npm run setup

# If you get "permission denied" error, run:
./scripts/fix-permissions.sh
```

That's it! No external config files needed.

## 📁 What Gets Created

### Directory Structure:

```
~/ccode/                    # Your contest directory
├── algo/
│   └── temp.cc            # C++ template file
├── mydebug.h              # Debug header file
└── [contest folders]/     # Auto-created contest folders
    ├── A.cpp, B.cpp...    # Problem files (with template)
    ├── A1.in, A1.ans...   # Test cases
    └── mydebug.h          # Auto-copied debug file
```

### Default Configuration (Built-in):

- ✅ Contest directory: `~/ccode`
- ✅ Debug file auto-copy: `enabled`
- ✅ Flat directory structure: `no platform subdirectories`
- ✅ C++ template: `~/ccode/algo/temp.cc`
- ✅ Editor: `code` (VS Code)

## 🎯 Usage

```bash
# Start server for Competitive Companion
cpb clone

# Test your solution
cpb test A.cpp

# Create new file with template
cpb create B.cpp

# View help
cpb --help
```

## 🔧 Features

### Built-in Debug Support

- `mydebug.h` automatically copied to each contest
- Use `#include "mydebug.h"` in your code
- Debug macros available: `debug(variable)`

### Template System

- C++ template with competitive programming setup
- Automatic `#include "mydebug.h"` integration
- Fast I/O setup included

### Contest Management

- Flat directory structure (no nested platform folders)
- Automatic test case extraction
- Organized file naming

## 🛠 Development

### Making Changes:

```bash
# Edit source files
nano src/Config/Config.ts

# Rebuild and reinstall
npm run setup
```

### Troubleshooting:

**Permission denied error (`zsh: permission denied: cpb`):**

```bash
./scripts/fix-permissions.sh
```

If global install fails, the setup script creates a local symlink in `~/bin/cpb`.
Add this to your shell profile:

```bash
export PATH="$HOME/bin:$PATH"
```

**Other issues:**

```bash
# Clean rebuild
sudo rm -rf dist node_modules
npm install
npm run setup
```

## 📋 Requirements

- Ubuntu 18.04+ (or any Debian-based system)
- Node.js 16+
- g++ compiler
- Competitive Companion browser extension

---

This setup provides a stable, config-free CPBooster installation with enhanced debug file management.
