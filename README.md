# Usetiful SDK

[![CI](https://github.com/usetiful/usetiful-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/usetiful/usetiful-sdk/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/usetiful-sdk.svg)](https://badge.fury.io/js/usetiful-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight TypeScript/JavaScript SDK for integrating Usetiful user onboarding and product tours into your web applications.

## Features

- 🚀 **Easy Integration** - Simple setup with a single function call
- 🔧 **TypeScript Support** - Full type definitions included
- 🎯 **React Optimized** - Built with React and SPA applications in mind
- 🏷️ **Tag Management** - Comprehensive user tagging and segmentation
- 🔄 **SPA Compatible** - Built-in support for Single Page Applications
- 📊 **Progress Tracking** - User progress management capabilities
- ⚡ **Lightweight** - Minimal bundle size impact (~2KB gzipped)

## Quick Start

### Installation

```bash
npm install usetiful-sdk
```

### Basic Usage

```typescript
import { loadUsetifulScript, setUsetifulTags } from 'usetiful-sdk';

// Initialize Usetiful with your token
loadUsetifulScript('your-usetiful-token');

// Set user tags for targeting
setUsetifulTags({
  userId: 'user-123',
  plan: 'pro',
  role: 'admin',
});
```

### React Integration

For React applications, use our custom hook:

```typescript
import { useUsetiful } from './hooks/useUsetiful';

function App() {
  const { updateUserTags } = useUsetiful({
    token: process.env.REACT_APP_USETIFUL_TOKEN!
  });

  useEffect(() => {
    if (user) {
      updateUserTags({
        userId: user.id,
        email: user.email,
        plan: user.plan
      });
    }
  }, [user, updateUserTags]);

  return <div>Your App</div>;
}
```

## Documentation

- 📖 **[React Integration Guide](docs/REACT_GUIDE.md)** - Complete guide for React applications with hooks, patterns, and best practices
- 📚 **[API Reference](docs/API_REFERENCE.md)** - Full function and type documentation with examples
- 🤝 **[Contributing Guide](CONTRIBUTING.md)** - Development setup, guidelines, and contribution process
- 💡 **[Examples](examples/)** - Practical examples and code samples

## Core Functions

| Function                               | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| `loadUsetifulScript(token, settings?)` | Initialize Usetiful with your project token  |
| `setUsetifulTags(tags)`                | Set user tags for targeting and segmentation |
| `setUsetifulTag(name, value)`          | Set a single user tag                        |
| `removeUsetifulTag(name)`              | Remove a specific tag                        |
| `removeAllUsetifulTags()`              | Remove all user tags                         |
| `reinitializeUsetiful()`               | Reinitialize after route changes in SPAs     |
| `clearUsetifulProgress()`              | Reset user's tour progress                   |

For complete API documentation, see [API Reference](docs/API_REFERENCE.md).

## Environment Configuration

```bash
# .env
REACT_APP_USETIFUL_TOKEN=your_token_here
```

## Common Patterns

### Authentication Flow

```typescript
// Login
setUsetifulTags({
  userId: user.id,
  email: user.email,
  plan: user.plan,
});

// Logout
removeAllUsetifulTags();
clearUsetifulProgress();
```

### SPA Navigation

```typescript
// After route changes
useEffect(() => {
  reinitializeUsetiful();
}, [location.pathname]);
```

### Feature Flags

```typescript
setUsetifulTags({
  feature_newDashboard: true,
  feature_advancedAnalytics: false,
});
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Node.js Support

- Node.js 20.x (LTS)
- Node.js 22.x (LTS)
- Node.js 24.x (Current)
- Node.js 25.x (Current)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Code quality
npm run typecheck      # TypeScript type checking
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run lint           # Run all linting

# Build package
npm run build

# Validate everything
npm run validate

# Release (maintainers only)
npm run release patch|minor|major
```

**Test Coverage**: 100% statements, 94% branches, 100% functions
**Code Quality**: TypeScript strict mode + Prettier formatting

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup and workflow
- Code style guidelines and best practices
- Testing requirements and patterns
- Pull request process

## Support & Resources

- 📚 [Full Documentation](docs/)
- 💬 [GitHub Discussions](https://github.com/usetiful/usetiful-sdk/discussions)
- 🐛 [Report Issues](https://github.com/usetiful/usetiful-sdk/issues)
- 📧 [Contact Support](mailto:support@usetiful.com)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and breaking changes.
