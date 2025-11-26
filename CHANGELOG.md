# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **🎨 Prettier integration** - Automatic code formatting with consistent style rules
- **🛠 VSCode workspace configuration** - Complete development environment setup
  - Shared settings for formatting, TypeScript, and file handling
  - Recommended extensions for optimal development experience
  - Debug configurations for Jest tests and build scripts
  - NPM script tasks integration
  - Code snippets for faster development
- **📚 Modular documentation structure**
  - `CONTRIBUTING.md` - Comprehensive development guidelines
  - `docs/REACT_GUIDE.md` - Complete React integration patterns and best practices
  - `docs/API_REFERENCE.md` - Full API documentation with examples
  - GitHub issue templates for bug reports and feature requests
  - Pull request template with comprehensive checklist
- **🧪 Enhanced test coverage** - 73 comprehensive test cases covering edge cases
- **✅ Comprehensive validation workflow** - `npm run validate` command for full project validation
- **🚀 Automated release script** - `npm run release` command for streamlined version publishing
  - Automated version bumping and CHANGELOG updates
  - Git tag creation and GitHub release generation
  - Full validation and safety checks before publishing
- **📄 MIT License file** to enable legal usage of the SDK
- **🔧 Core SDK functions** for comprehensive Usetiful integration:
  - `clearUsetifulProgress()` function to clear user progress through all tours and guides
  - `removeAllUsetifulTags()` function to remove all tags at once
  - `removeUsetifulTag(tagName)` function to remove specific tags
  - `setUsetifulTag(tagName, value)` function to set individual tags
  - `reinitializeUsetiful()` function to reinitialize Usetiful for SPA language detection
- **📝 TypeScript interfaces** - Updated to include all available UserApi methods
- **🚀 GitHub Actions CI/CD pipeline** for automated testing, building, and publishing
  - Automated npm publishing workflow with enhanced security and validation
  - NPM_TOKEN integration for secure package publishing to npmjs.com
  - Automated dependency update workflow
  - Comprehensive testing on multiple Node.js versions

### Enhanced
- **📖 Complete documentation rewrite** with React best practices and comprehensive examples
- **🔧 React integration guides** with custom hooks and component patterns
- **⚡ Framework integration examples** - Next.js and Vue.js patterns
- **📊 API reference** with detailed parameter documentation
- **🎯 Common patterns** for authentication flows, feature flags, and A/B testing
- **🚀 Production-ready examples** for real-world applications

### Changed
- **📦 Node.js support updated** - Now requires Node.js 20+ (dropped 18.x support)
  - CI testing on Node.js 20.x, 22.x, 24.x, 25.x
  - Updated all GitHub Actions to use Node.js 22.x (LTS)
  - Package engines requirement updated to `>=20.0.0`
- **🚀 Improved GitHub Actions workflows**
  - Enhanced CI pipeline with separate lint, test, and build jobs
  - Added Prettier formatting checks to all workflows
  - Better error handling and validation in publish workflow
  - Enhanced npm publishing with security checks and verification steps
  - NPM_TOKEN authentication and duplicate version prevention
  - Optimized dependency update automation
- **📖 Streamlined README.md** - Focused content with references to detailed documentation
- **🔧 Enhanced package.json scripts**
  - Added `format` and `format:check` commands for Prettier
  - Updated `lint` command to include both TypeScript and Prettier checks
  - Improved `validate` command for comprehensive project validation
  - Enhanced build scripts with `clean` and `typecheck` commands
- **📦 Standardized on npm** package manager (removed yarn references)
- **📝 Enhanced package.json** with proper metadata and npm best practices

### Fixed
- **🔧 TypeScript configuration** - Resolved tsconfig.json conflicts with noEmit option
- **🧹 Build and validation pipeline** - All scripts now work reliably
- **📝 Documentation consistency** - Removed duplicate sections and improved organization
- **🔒 Package security** - Using only actively supported Node.js versions
- **🛠 TypeScript type definitions** - Fixed missing UserApi methods
- **🔄 SPA language detection** - Addressed issue by providing reinitialize function
- **🛡 Input handling** - Improved null/undefined input handling in setUsetifulTags function
- **⚙️ GitHub Actions workflows** - Fixed YAML syntax errors and dependency installation issues
  - Corrected indentation errors in deps.yml workflow
  - Removed npm cache usage (no package-lock.json file)
  - Changed from `npm ci` to `npm install` for consistent dependency installation

### Security
- **🛡 Node.js version security** - Dropped support for Node.js 18.x (end of active support)
- **🔐 CI/CD hardening** - Updated all GitHub Actions to use latest versions


### Issues Resolved
- Issue #2: Expose user.clearProgress()
- Issue #4: Type UserApi missing function definitions
- Issue #5: Missing LICENSE file
- Issue #6: Single Page Application Language Detection

## [0.2.0] - Previous version
- Basic functionality for loading Usetiful script and setting tags
