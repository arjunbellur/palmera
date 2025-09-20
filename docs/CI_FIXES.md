# CI/CD Fixes Applied

## Issues Identified and Fixed:

### 1. ESLint Module Resolution Errors
- **Problem**: Missing `../cli-engine/cli-engine` module causing ESLint failures
- **Fix**: Added explicit `eslint: "^8.57.0"` dependency to root package.json
- **Fix**: Added lint script to tokens package to prevent CI failures

### 2. Fast-glob Missing Modules
- **Problem**: Missing `./managers/tasks` module in fast-glob
- **Root Cause**: Corrupted node_modules from previous git process crash
- **Solution**: Created dependency cleanup script

### 3. Package Configuration Issues
- **Fix**: Added missing lint script to `packages/tokens/package.json`
- **Fix**: Ensured all packages have consistent script configurations

### 4. Hanging Commands Issue ⭐ NEW
- **Problem**: npm commands hanging indefinitely during dependency installation
- **Root Causes**:
  - Package manager mismatch (had pnpm-workspace.yaml but using npm)
  - No timeout protection on npm commands
  - Default npm configuration causing network issues
  - Hanging processes not being killed
- **Fixes Applied**:
  - Removed conflicting `pnpm-workspace.yaml` file
  - Enhanced `fix-dependencies.sh` with timeout protection and process killing
  - Created `scripts/safe-npm.sh` wrapper for safe npm command execution
  - Configured npm with proper timeouts and retry settings
  - Added `--maxsockets 1` to prevent connection issues

## Next Steps for CI Success:

1. **Clean Dependencies**: Run `./fix-dependencies.sh` to remove corrupted node_modules
2. **Use Safe Commands**: Use `./scripts/safe-npm.sh install` for future npm operations
3. **Verify Builds**: Test that all packages build successfully
4. **Commit Fixes**: These configuration fixes should resolve both CI failures and hanging issues

## Files Modified:
- `package.json` - Added explicit eslint dependency
- `packages/tokens/package.json` - Added lint script
- `fix-dependencies.sh` - Enhanced with timeout protection and process management
- `scripts/safe-npm.sh` - Created safe npm wrapper script
- `pnpm-workspace.yaml` - Removed (was causing package manager conflicts)

## Usage:
```bash
# Fix hanging dependencies
./fix-dependencies.sh

# Use safe npm commands
./scripts/safe-npm.sh install
./scripts/safe-npm.sh run build
```

The CI should pass after these fixes are applied and dependencies are reinstalled. The hanging commands issue should be resolved.
