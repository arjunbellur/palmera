const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo
config.watchFolders = [workspaceRoot];

// Resolve modules from the root to avoid duplicates
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// If needed for some deps:
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

module.exports = config;