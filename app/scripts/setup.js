#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

console.log("🚀 Setting up CPBooster...\n");

// Create ccode directory
const ccodeDir = path.join(os.homedir(), "ccode");
if (!fs.existsSync(ccodeDir)) {
  fs.mkdirSync(ccodeDir, { recursive: true });
  console.log("✅ Created ~/ccode directory");
}

// Create template.cpp (only if it doesn't exist)
const templatePath = path.join(ccodeDir, "algo", "temp.cc");
const templateDir = path.dirname(templatePath);

if (!fs.existsSync(templateDir)) {
  fs.mkdirSync(templateDir, { recursive: true });
  console.log("✅ Created ~/ccode/algo directory");
}

const templateContent = `#include <bits/stdc++.h>
using namespace std;

#ifdef DEBUG
#include "mydebug.h"
#else
#define debug(...) 42
#endif

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}
`;

if (!fs.existsSync(templatePath)) {
  fs.writeFileSync(templatePath, templateContent);
  console.log("✅ Created algo/temp.cc template");
} else {
  console.log("✅ Found existing template: algo/temp.cc");
}

// Create mydebug.h
const debugPath = path.join(ccodeDir, "mydebug.h");
const debugContent = `#pragma once
#include <bits/stdc++.h>
using namespace std;

template<typename T> 
void debug(T x) { 
    cerr << x; 
}

template<typename T, typename... Args> 
void debug(T x, Args... args) { 
    cerr << x << " "; 
    debug(args...); 
}

#define debug(...) cerr << "[" << #__VA_ARGS__ << "]: "; debug(__VA_ARGS__); cerr << endl;
`;

if (!fs.existsSync(debugPath)) {
  fs.writeFileSync(debugPath, debugContent);
  console.log("✅ Created mydebug.h");
}

// Ensure built file has execute permissions
const builtIndexPath = path.resolve(__dirname, "..", "dist", "src", "index.js");
if (fs.existsSync(builtIndexPath)) {
  fs.chmodSync(builtIndexPath, "755");
  console.log("✅ Set execute permissions on built file");
}

// Check if we need to use sudo for global install
let needsSudo = false;
try {
  const npmPrefix = execSync("npm config get prefix", { encoding: "utf8" }).trim();
  const testPath = path.join(npmPrefix, "lib", "node_modules");
  fs.accessSync(testPath, fs.constants.W_OK);
} catch (error) {
  needsSudo = true;
}

// Install globally
console.log("📦 Installing CPBooster globally...");
try {
  const installCmd = needsSudo ? "sudo npm install -g" : "npm install -g";
  execSync(installCmd, { stdio: "inherit" });

  // After global install, ensure the global file has execute permissions
  try {
    const npmPrefix = execSync("npm config get prefix", { encoding: "utf8" }).trim();
    const globalIndexPath = path.join(
      npmPrefix,
      "lib",
      "node_modules",
      "cpbooster",
      "dist",
      "src",
      "index.js"
    );
    if (fs.existsSync(globalIndexPath)) {
      execSync(`sudo chmod +x "${globalIndexPath}"`, { stdio: "pipe" });
      console.log("✅ Set execute permissions on global installation");
    }
  } catch (permError) {
    console.log("⚠️  Could not set global permissions automatically");
  }

  console.log("✅ CPBooster installed globally");
} catch (error) {
  console.error("❌ Failed to install globally:", error.message);
  console.log("\n💡 Alternative: Creating local installation...");

  // Create a local symlink as fallback
  const binDir = path.join(os.homedir(), "bin");
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir);
  }

  const sourcePath = path.resolve(__dirname, "..", "dist", "src", "index.js");
  const targetPath = path.join(binDir, "cpb");

  try {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.symlinkSync(sourcePath, targetPath);
    fs.chmodSync(sourcePath, "755");
    console.log(`✅ Created local symlink: ${targetPath}`);
    console.log('💡 Add ~/bin to your PATH: export PATH="$HOME/bin:$PATH"');
  } catch (symlinkError) {
    console.error("❌ Failed to create symlink:", symlinkError.message);
  }
}

console.log("\n🎉 Setup complete!");
console.log("📝 Default configuration:");
console.log("  - Contest directory: ~/ccode");
console.log("  - Debug file: ~/ccode/mydebug.h (auto-copied to contests)");
console.log("  - Template: ~/ccode/algo/temp.cc");
console.log("  - No platform directories (flat structure)");
console.log("\n🚀 Usage:");
console.log("  cpb clone    # Start server for Competitive Companion");
console.log("  cpb test A.cpp   # Test your solution");
console.log("  cpb create B.cpp # Create new file with template");

// Test the installation
console.log("\n🧪 Testing installation...");
try {
  const version = execSync("cpb --version", { encoding: "utf8", stdio: "pipe" });
  console.log(`✅ cpb command working: v${version.trim()}`);
} catch (testError) {
  console.log("⚠️  cpb command not found in PATH");
  console.log('💡 Try running: export PATH="$HOME/bin:$PATH"');
}
