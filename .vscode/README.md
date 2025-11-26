# VSCode Development Setup

This project includes VSCode configuration for optimal development experience.

## Included Configurations

### Settings (`.vscode/settings.json`)
- **Prettier formatting** on save
- **TypeScript optimization** with auto-imports
- **File management** (EOL, trim whitespace)
- **Search exclusions** (node_modules, dist, coverage)
- **Language-specific** formatting rules

### Recommended Extensions (`.vscode/extensions.json`)
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TS support
- **Jest** - Test runner integration
- **GitLens** - Git supercharged
- **NPM IntelliSense** - Package suggestions
- **Markdown** - Documentation support

### Tasks (`.vscode/tasks.json`)
Quick access to npm scripts:
- `Ctrl+Shift+P` → "Tasks: Run Task"
- Available tasks: test, build, lint, format, typecheck

### Debug Configurations (`.vscode/launch.json`)
- **Debug Jest Tests** - Run tests with breakpoints
- **Debug Current Test** - Debug specific test file
- **Debug Build Script** - Debug the build process

### Code Snippets (`.vscode/snippets/typescript.json`)
Type prefixes for quick code generation:
- `describe` - Jest test suite
- `it` - Jest test case
- `mock` - Mock function
- `interface` - TypeScript interface
- `expfn` - Export function
- `sdkfn` - SDK function template

## Quick Setup

1. **Install VSCode** (if not already installed)
2. **Open project** in VSCode
3. **Install recommended extensions** when prompted
4. **Start coding** - formatting and linting happen automatically

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Format Document | `Shift+Alt+F` | `Shift+Option+F` |
| Organize Imports | `Shift+Alt+O` | `Shift+Option+O` |
| Run Tests | `Ctrl+Shift+P` → "Test" | `Cmd+Shift+P` → "Test" |
| Run Tasks | `Ctrl+Shift+P` → "Tasks" | `Cmd+Shift+P` → "Tasks" |

## Debugging

### Debug Tests
1. Set breakpoints in test files
2. Press `F5` or use "Debug Jest Tests" configuration
3. Tests will stop at breakpoints

### Debug Build
1. Set breakpoints in `build.ts`
2. Use "Debug Build Script" configuration
3. Step through build process

## Customization

Feel free to add personal settings to your local VSCode, but avoid committing:
- Personal keybindings
- Theme preferences
- Extension-specific settings not relevant to the project

The shared settings focus on code quality and consistency across all contributors.
