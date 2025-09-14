const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo
config.watchFolders = [workspaceRoot];

// Resolve modules from root and app node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// Some packages ship .cjs
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// Make sure @babel/runtime always resolves from root node_modules
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),
  '@': path.resolve(projectRoot, 'src'),
  '@palmera/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
  '@palmera/schemas': path.resolve(workspaceRoot, 'packages/schemas/src'),
  '@palmera/sdk': path.resolve(workspaceRoot, 'packages/sdk/src'),
  '@palmera/i18n': path.resolve(workspaceRoot, 'packages/i18n/src'),
};

// Enable symlinks for monorepo
config.resolver.unstable_enableSymlinks = true;

module.exports = config;