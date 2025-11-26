# Contributing to Usetiful SDK

Thank you for considering contributing to the Usetiful SDK! This document outlines the process and guidelines for contributing.

## Getting Started

### Prerequisites

- Node.js 20.x or higher (LTS recommended)
- npm (package manager)
- Git

### Setup Development Environment

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/usetiful-sdk.git
   cd usetiful-sdk
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run tests**

   ```bash
   npm test
   ```

4. **Build the package**
   ```bash
   npm run build
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test-related changes
- `chore/` - Maintenance tasks

Example: `feat/add-user-identification`

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style and patterns
   - Add/update tests for your changes
   - Update documentation if needed

3. **Run tests**

   ```bash
   npm test
   npm run test:coverage
   ```

4. **Build and verify**
   ```bash
   npm run build
   npm run typecheck
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Maintain 95%+ test coverage
- Use meaningful variable and function names
- Code must be formatted with Prettier (run `npm run format`)
- Follow the project's Prettier configuration

### Testing Guidelines

- Write unit tests for all new functionality
- Include edge case testing
- Test error handling scenarios
- Maintain high test coverage

**Test Structure:**

```typescript
describe('functionName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something when condition', () => {
    // Test implementation
  });

  it('should handle error case', () => {
    // Error testing
  });
});
```

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update examples if API changes
- Update CHANGELOG.md

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**

   ```bash
   npm test
   npm run test:coverage
   ```

2. **Verify build works**

   ```bash
   npm run build
   npm run typecheck
   ```

3. **Update documentation**
   - README.md if needed
   - CHANGELOG.md with your changes
   - Code comments and examples

### Submitting the PR

1. **Create descriptive PR title**
   - Use conventional commit format: `feat: add user identification`
   - Be clear and concise

2. **Fill out PR description**
   - Explain what changes were made
   - Reference any related issues
   - Include testing instructions

3. **Request review**
   - Tag relevant maintainers
   - Be responsive to feedback

### PR Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Test improvement

## Testing

- [ ] All existing tests pass
- [ ] New tests added for changes
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond promptly to review comments
- Make requested changes in separate commits
- Keep discussions focused and professional

### For Reviewers

- Be constructive and helpful
- Focus on code quality and maintainability
- Check for proper testing
- Verify documentation updates

## Release Process (Maintainers Only)

This project follows semantic versioning and provides an automated release script for maintainers.

### Quick Release (Recommended)

Use the automated release script:

```bash
# Patch release (0.3.0 → 0.3.1) - bug fixes
npm run release patch

# Minor release (0.3.0 → 0.4.0) - new features
npm run release minor

# Major release (0.3.0 → 1.0.0) - breaking changes
npm run release major
```

The script automatically:

- ✅ Validates git state (clean working directory, up-to-date master branch)
- ✅ Runs full project validation (`npm run validate`)
- ✅ Updates version in package.json
- ✅ Updates CHANGELOG.md with release date
- ✅ Commits changes with conventional commit message
- ✅ Creates and pushes git tag
- ✅ Creates GitHub release (if GitHub CLI available)
- ✅ Triggers automated npm publishing via GitHub Actions

### Manual Release Process

If you prefer manual control or the script fails:

#### 1. Prerequisites

- [ ] All tests passing in CI
- [ ] Clean git working directory
- [ ] On master branch and up-to-date
- [ ] Documentation updated
- [ ] CHANGELOG.md has unreleased changes

#### 2. Prepare Release

```bash
# 1. Update version
npm version patch|minor|major --no-git-tag-version

# 2. Update CHANGELOG.md
# - Move items from [Unreleased] to new version section
# - Add release date: ## [0.4.0] - 2025-11-26
# - Create new empty [Unreleased] section

# 3. Validate everything
npm run validate

# 4. Commit changes
git add .
git commit -m "chore: prepare release v0.4.0"
git push origin master
```

#### 3. Create Release

```bash
# Create and push tag
git tag v0.4.0
git push origin v0.4.0

# Create GitHub release (manual alternative)
# Go to: https://github.com/usetiful/usetiful-sdk/releases/new
# - Tag: v0.4.0
# - Target: master
# - Title: v0.4.0
# - Description: Copy from CHANGELOG.md
```

#### 4. Monitor Automated Publishing

After GitHub release is created:

- 📈 Monitor: https://github.com/usetiful/usetiful-sdk/actions
- 📦 Verify: https://www.npmjs.com/package/usetiful-sdk
- 🔍 Check: Version appears on npm within ~5 minutes

### Semantic Versioning Guide

This project follows [Semantic Versioning](https://semver.org/):

| Type              | When to Use                        | Example                    |
| ----------------- | ---------------------------------- | -------------------------- |
| **PATCH** (0.3.1) | Bug fixes, documentation updates   | Fix null handling bug      |
| **MINOR** (0.4.0) | New features (backward compatible) | Add new SDK function       |
| **MAJOR** (1.0.0) | Breaking changes                   | Change function signatures |

### Release Checklist

#### Pre-Release

- [ ] All CI checks green
- [ ] Branch is up-to-date with master
- [ ] No uncommitted changes
- [ ] Documentation reflects changes
- [ ] CHANGELOG.md updated with unreleased changes
- [ ] `npm run validate` passes locally

#### Release

- [ ] Correct version type chosen (patch/minor/major)
- [ ] Release script completed successfully OR manual steps done
- [ ] Git tag created and pushed
- [ ] GitHub release published
- [ ] GitHub Actions publish workflow triggered

#### Post-Release

- [ ] GitHub Actions completed successfully
- [ ] Package available on npm
- [ ] Version matches across GitHub and npm
- [ ] Release announcement (if needed)

### Troubleshooting

**Release script fails on git validation**

```bash
# Ensure clean state
git status
git stash  # if needed
git checkout master
git pull origin master
```

**GitHub CLI not available**

```bash
# Install GitHub CLI (optional)
brew install gh  # macOS
gh auth login    # authenticate
```

**Rollback needed**

```bash
# Deprecate npm version
npm deprecate usetiful-sdk@0.4.0 "Critical issue, use 0.4.1+"

# Delete GitHub release and tag
# Go to GitHub releases and delete
git tag -d v0.4.0
git push origin :v0.4.0

# Publish hotfix
npm run release patch
```

**NPM publishing fails**

- Verify NPM_TOKEN secret is valid
- Check token permissions include publish access
- Ensure version doesn't already exist on npm

For detailed troubleshooting, see [Release Process Guide](docs/RELEASE_PROCESS.md).

## Issue Reporting

### Bug Reports

Use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, Node.js version, etc.)
- Code examples if applicable

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Use cases and benefits
- Proposed API design (if applicable)
- Alternatives considered

## Community Guidelines

- Be respectful and inclusive
- Help others learn and contribute
- Follow the [Code of Conduct](https://github.com/usetiful/.github/blob/main/CODE_OF_CONDUCT.md)
- Keep discussions on-topic

## Getting Help

- Check existing [issues](https://github.com/usetiful/usetiful-sdk/issues)
- Read the [documentation](README.md)
- Ask questions in issue discussions
- Contact maintainers for complex questions

## Project Structure

```
usetiful-sdk/
├── src/              # Source code
│   └── index.ts      # Main SDK file
├── tests/            # Test files
├── examples/         # Usage examples
├── dist/             # Built files (generated)
├── docs/             # Documentation files
└── .github/          # GitHub Actions and templates
```

## Development Commands

```bash
# Install dependencies
npm install

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Code quality
npm run typecheck
npm run format          # Format code with Prettier
npm run format:check    # Check if code is formatted
npm run lint            # Run all linting (TypeScript + Prettier)

# Build package
npm run build
npm run build:dev
npm run build:local

# Validation
npm run validate        # Run all checks (lint + test + build)

# Clean build artifacts
npm run clean
```

Thank you for contributing to Usetiful SDK! 🚀
