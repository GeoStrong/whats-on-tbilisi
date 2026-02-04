const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, "../..")];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

// Add expo-router configuration
config.resolver.sourceExts.push("cjs");

// Ensure Tailwind CSS is properly configured
module.exports = withNativeWind(config, { tailwindConfig: path.resolve(__dirname, "tailwind.config.js") });
