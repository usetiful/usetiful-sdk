# Release Process

This document outlines the automated release process for the Usetiful SDK.

## Quick Start (Recommended)

The project includes an automated release script that handles the entire process:

```bash
# For bug fixes (0.3.0 → 0.3.1)
npm run release patch

# For new features (0.3.0 → 0.4.0)
npm run release minor

# For breaking changes (0.3.0 → 1.0.0)
npm run release major
```

## What the Script Does

The release script automatically:

- ✅ **Validates git state**: Clean working directory, master branch, up-to-date
- ✅ **Validates environment**: Node.js 20+, package.json exists
- ✅ **Runs project validation**: `npm run validate` (tests, linting, builds)
- ✅ **Updates version**: Uses `npm version` to bump package.json
- ✅ **Updates CHANGELOG**: Moves [Unreleased] items to versioned section with date
- ✅ **Commits changes**: Creates conventional commit `chore: release vX.Y.Z`
- ✅ **Creates git tag**: Tags commit and pushes to origin
- ✅ **Creates GitHub release**: Automatically via GitHub CLI (if available)
- ✅ **Triggers npm publishing**: GitHub Actions workflow publishes to npm

## Prerequisites

1. **Repository access**: Maintainer permissions on usetiful/usetiful-sdk
2. **NPM_TOKEN secret**: Must be configured in repository secrets
3. **Clean git state**: No uncommitted changes, on master branch
4. **Node.js 20+**: Required for release script execution
5. **GitHub CLI (optional)**: For automatic GitHub release creation

## Step-by-Step Process

### 1. Prepare Environment

```bash
# Ensure you're on master and up-to-date
git checkout master
git pull origin master

# Check working directory is clean
git status

# Validate project is ready
npm run validate
```

### 2. Choose Version Type

Follow [Semantic Versioning](https://semver.org/):

| Type    | When to Use                        | Example Change         |
| ------- | ---------------------------------- | ---------------------- |
| `patch` | Bug fixes, documentation           | Fix null pointer error |
| `minor` | New features (backward compatible) | Add new SDK function   |
| `major` | Breaking changes                   | Remove deprecated API  |

### 3. Run Release

```bash
npm run release <type>
```

The script will:

1. Show confirmation prompt with current → new version
2. Run all validations automatically
3. Update version and changelog
4. Commit and push changes
5. Create GitHub release
6. Provide monitoring links

### 4. Monitor Publishing

After completion, monitor these links:

- 📈 **GitHub Actions**: https://github.com/usetiful/usetiful-sdk/actions
- 📦 **npm Package**: https://www.npmjs.com/package/usetiful-sdk
- 📊 **GitHub Release**: https://github.com/usetiful/usetiful-sdk/releases

Publishing to npm typically completes within 2-5 minutes.

## Manual Fallback Process

If the automated script fails, you can release manually:

### 1. Update Version

```bash
npm version patch|minor|major --no-git-tag-version
```

### 2. Update CHANGELOG.md

- Move items from `[Unreleased]` to new version section
- Add today's date: `## [0.4.0] - 2025-11-26`
- Create new empty `[Unreleased]` section

### 3. Commit and Tag

```bash
git add .
git commit -m "chore: release v0.4.0"
git tag v0.4.0
git push origin master
git push origin v0.4.0
```

### 4. Create GitHub Release

- Go to: https://github.com/usetiful/usetiful-sdk/releases/new
- Tag: `v0.4.0`, Target: `master`
- Title: `v0.4.0`
- Description: Copy from CHANGELOG.md
- Click "Publish release"

## Troubleshooting

### Common Issues

**Script fails: "Please switch to master branch"**

```bash
git checkout master
```

**Script fails: "Please commit or stash your changes"**

```bash
git status
git add . && git commit -m "prepare for release"
# or
git stash
```

**Script fails: "Your branch is behind origin/master"**

```bash
git pull origin master
```

**Script fails: "Validation failed"**

```bash
npm run validate
# Fix any failing tests, linting, or build issues
```

**GitHub CLI not found**

- Install: `brew install gh` (macOS) or see https://cli.github.com/
- Or create GitHub release manually after script completes

**NPM publishing fails**

- Check NPM_TOKEN secret is valid and has publish permissions
- Verify version doesn't already exist on npm
- Wait for GitHub Actions to complete (check Actions tab)

### Rollback Process

If you need to rollback a release:

**1. Deprecate npm version**

```bash
npm deprecate usetiful-sdk@0.4.0 "Critical issue, use 0.4.1+"
```

**2. Delete GitHub release and tag**

- Delete from GitHub releases UI
- Delete tag: `git tag -d v0.4.0 && git push origin :v0.4.0`

**3. Publish hotfix**

```bash
# Fix the issue, then:
npm run release patch
```

## Release Checklist

### Pre-Release

- [ ] All CI checks passing
- [ ] On master branch and up-to-date
- [ ] Working directory clean
- [ ] Documentation updated
- [ ] CHANGELOG has unreleased items

### Release

- [ ] Choose correct version type (patch/minor/major)
- [ ] Run `npm run release <type>`
- [ ] Confirm changes when prompted
- [ ] Monitor script completion

### Post-Release

- [ ] GitHub Actions workflow completed
- [ ] Package available on npm
- [ ] Version matches across GitHub and npm
- [ ] Test installation: `npm install usetiful-sdk@latest`

## GitHub Actions Workflow

The automated npm publishing workflow:

1. **Trigger**: GitHub release published
2. **Validation**: Full test suite, linting, type checking, builds
3. **Version check**: Ensures package.json matches release tag
4. **Authentication**: Verifies NPM_TOKEN
5. **Duplicate check**: Ensures version doesn't exist on npm
6. **Publishing**: Uploads to npm with public access
7. **Verification**: Confirms successful publication

Environment: Uses protected `npm-publish` environment for security.

## Semantic Versioning Examples

- `0.3.0 → 0.3.1`: Fix bug in tag handling
- `0.3.0 → 0.4.0`: Add new `setUsetifulConfig()` function
- `0.3.0 → 1.0.0`: Remove deprecated functions, change API signatures

For more details, see: https://semver.org/
