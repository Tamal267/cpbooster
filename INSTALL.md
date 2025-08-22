# CPBooster Enhanced - Complete Setup Guide

## 🚀 One-Command Setup for New Ubuntu PC

### Prerequisites Installation

```bash
# Install Node.js and build tools (run once per system)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git g++
```

### CPBooster Installation

```bash
# Clone your enhanced cpbooster fork
git clone https://github.com/Tamal267/cpbooster.git
cd cpbooster/app

# Install dependencies and setup
npm install
npm run setup
```

**That's it!** No external config files needed.

## 📁 Directory Structure

After setup, you'll have:

```
~/ccode/
├── algo/
│   └── temp.cc            # Your existing C++ template
├── mydebug.h              # Debug header (auto-copied to contests)
└── [contest folders]/     # Auto-created when fetching contests
    ├── A.cpp, B.cpp...    # Problem files (using your temp.cc)
    ├── A1.in, A1.ans...   # Test cases
    └── mydebug.h          # Auto-copied for easy debugging
```

## ⚙️ Built-in Configuration

**No config file needed!** Defaults are:

- ✅ Contest directory: `~/ccode`
- ✅ Template file: `~/ccode/algo/temp.cc`
- ✅ Debug file: `~/ccode/mydebug.h` (auto-copied)
- ✅ Flat directory structure (no platform subdirectories)
- ✅ Editor: VS Code (`code`)

## 🎯 Usage

```bash
# Start server for Competitive Companion
cpb clone

# Test your solution
cpb test A.cpp

# Create new file with your template
cpb create B.cpp

# View all commands
cpb --help
```

## 🔧 Features

### 🐛 Enhanced Debug Support

- Your `mydebug.h` is automatically copied to every contest folder
- Include with: `#include "mydebug.h"`
- Use debug macros: `debug(variable)`

### 📝 Template Integration

- Uses your existing `~/ccode/algo/temp.cc`
- All new `.cpp` files get your template content
- Seamless integration with your workflow

### 📂 Smart Directory Management

- No nested platform folders (clean structure)
- Contests appear directly in `~/ccode/`
- Example: `~/ccode/CodeforcesRound950Div3/`

## 🛠 Development & Updates

### Making Changes:

```bash
cd cpbooster/app
# Edit source files as needed
npm run build
sudo npm install -g
```

### Staying Updated:

```bash
cd cpbooster
git pull origin develop
cd app
npm run setup
```

## 🔍 Verification

After setup, verify everything works:

```bash
# Check installation
cpb --version

# Check your template exists
ls ~/ccode/algo/temp.cc

# Check debug file exists
ls ~/ccode/mydebug.h

# Test creating a file
cpb create test.cpp
cat test.cpp  # Should contain your template
```

## 🌐 Browser Extension

Install **Competitive Companion**:

- [Chrome](https://chrome.google.com/webstore/detail/competitive-companion/cjnmckjndlpiamhfimnnjmnckgghkjbl)
- [Firefox](https://addons.mozilla.org/firefox/addon/competitive-companion/)

## 📋 Workflow Example

1. **Start CPBooster**: `cpb clone`
2. **Open Codeforces contest** in browser
3. **Click Competitive Companion** icon
4. **Files auto-created** in `~/ccode/ContestName/`:
   - `A.cpp` (with your `temp.cc` content)
   - `A1.in`, `A1.ans` (test cases)
   - `mydebug.h` (your debug file)
5. **Code and test**: `cpb test A.cpp`

This setup is completely self-contained and uses your existing file structure!

---

## 🚨 Troubleshooting

**If `cpb` command not found:**

```bash
# Check if installed globally
which cpb

# If not found, try local install
export PATH="$HOME/bin:$PATH"
```

**If permission issues during setup:**

```bash
# Clean and retry
cd cpbooster/app
sudo rm -rf dist node_modules
npm install
npm run setup
```
