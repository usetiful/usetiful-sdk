#!/usr/bin/env node

/**
 * Release Script for Usetiful SDK
 *
 * This script automates the release process:
 * - Validates current state
 * - Updates version
 * - Updates CHANGELOG
 * - Commits changes
 * - Creates GitHub release
 *
 * Usage:
 *   npm run release patch|minor|major
 *   node scripts/release.js patch|minor|major
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result ? result.trim() : '';
  } catch (error) {
    if (!options.allowError) {
      throw error;
    }
    return null;
  }
}

function validateGitState() {
  info('Validating git state...');

  // Check if we're on master branch
  const currentBranch = execCommand('git branch --show-current', {
    silent: true,
  });
  if (currentBranch !== 'master') {
    error(`Please switch to master branch (currently on: ${currentBranch})`);
  }

  // Check for uncommitted changes
  const gitStatus = execCommand('git status --porcelain', { silent: true });
  if (gitStatus) {
    error('Please commit or stash your changes before releasing');
  }

  // Check if we're up to date with origin
  execCommand('git fetch origin');
  const behind = execCommand('git rev-list --count HEAD..origin/master', {
    silent: true,
  });
  if (behind && parseInt(behind) > 0) {
    error('Your branch is behind origin/master. Please pull latest changes');
  }

  success('Git state is clean and up to date');
}

function validateEnvironment() {
  info('Validating environment...');

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 20) {
    error(`Node.js 20+ required (current: ${nodeVersion})`);
  }

  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    error('package.json not found. Please run from project root');
  }

  success('Environment is valid');
}

function runValidation() {
  info('Running project validation...');

  try {
    execCommand('npm run validate');
    success('All validation checks passed');
  } catch (error) {
    error('Validation failed. Please fix issues before releasing');
  }
}

function updateVersion(versionType) {
  info(`Updating version (${versionType})...`);

  const result = execCommand(
    `npm version ${versionType} --no-git-tag-version`,
    { silent: true }
  );
  const newVersion = result.replace('v', '');

  success(`Version updated to ${newVersion}`);
  return newVersion;
}

function updateChangelog(version) {
  info('Updating CHANGELOG.md...');

  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    warning('CHANGELOG.md not found, skipping update');
    return;
  }

  let changelog = fs.readFileSync(changelogPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  // Replace [Unreleased] with version and date
  changelog = changelog.replace(
    '## [Unreleased]',
    `## [Unreleased]\n\n## [${version}] - ${today}`
  );

  fs.writeFileSync(changelogPath, changelog);
  success('CHANGELOG.md updated');
}

function commitChanges(version) {
  info('Committing changes...');

  execCommand('git add .');
  execCommand(`git commit -m "chore: release v${version}"`);

  success('Changes committed');
}

function createGitTag(version) {
  info('Creating git tag...');

  const tagName = `v${version}`;
  execCommand(`git tag ${tagName}`);
  execCommand(`git push origin master`);
  execCommand(`git push origin ${tagName}`);

  success(`Tag ${tagName} created and pushed`);
  return tagName;
}

function createGithubRelease(version, tagName) {
  info('Creating GitHub release...');

  // Check if GitHub CLI is available
  const ghAvailable = execCommand('which gh', {
    silent: true,
    allowError: true,
  });

  if (!ghAvailable) {
    warning(
      'GitHub CLI (gh) not found. Please create GitHub release manually:'
    );
    console.log(`
${colors.yellow}Manual steps:${colors.reset}
1. Go to: https://github.com/usetiful/usetiful-sdk/releases/new
2. Choose tag: ${tagName}
3. Release title: ${tagName}
4. Description: Copy from CHANGELOG.md section for v${version}
5. Publish release
`);
    return;
  }

  // Extract changelog for this version
  let releaseNotes = '';
  try {
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    const versionRegex = new RegExp(
      `## \\[${version}\\] - \\d{4}-\\d{2}-\\d{2}\\n\\n([\\s\\S]*?)\\n## \\[`
    );
    const match = changelog.match(versionRegex);
    if (match) {
      releaseNotes = match[1].trim();
    }
  } catch (error) {
    warning('Could not extract release notes from CHANGELOG.md');
  }

  if (!releaseNotes) {
    releaseNotes = `Release ${version}\n\nSee CHANGELOG.md for details.`;
  }

  // Create release
  execCommand(
    `gh release create ${tagName} --title "${tagName}" --notes "${releaseNotes}"`
  );

  success(`GitHub release ${tagName} created`);
  info(`🚀 GitHub Actions will automatically publish to npm`);
  info(`📦 Monitor at: https://github.com/usetiful/usetiful-sdk/actions`);
}

async function main() {
  const versionType = process.argv[2];

  if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
    error('Usage: node scripts/release.js <patch|minor|major>');
  }

  console.log(`${colors.bold}🚀 Usetiful SDK Release Process${colors.reset}\n`);

  try {
    // Validation phase
    validateEnvironment();
    validateGitState();
    runValidation();

    // Get current version for confirmation
    const currentVersion = JSON.parse(
      fs.readFileSync('package.json', 'utf8')
    ).version;

    // Confirm release
    console.log(`\n${colors.yellow}About to release:${colors.reset}`);
    console.log(`  Current version: ${currentVersion}`);
    console.log(`  Release type: ${versionType}`);
    console.log(`  Branch: master\n`);

    // For non-interactive environments, skip confirmation
    if (process.env.CI !== 'true') {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise(resolve => {
        rl.question('Continue with release? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        info('Release cancelled');
        process.exit(0);
      }
    }

    console.log('');

    // Release phase
    const newVersion = updateVersion(versionType);
    updateChangelog(newVersion);
    commitChanges(newVersion);
    const tagName = createGitTag(newVersion);
    createGithubRelease(newVersion, tagName);

    console.log(
      `\n${colors.green}${colors.bold}🎉 Release ${newVersion} completed successfully!${colors.reset}\n`
    );
    console.log(`Next steps:`);
    console.log(
      `  📈 Monitor GitHub Actions: https://github.com/usetiful/usetiful-sdk/actions`
    );
    console.log(`  📦 Check npm: https://www.npmjs.com/package/usetiful-sdk`);
    console.log(
      `  📊 View release: https://github.com/usetiful/usetiful-sdk/releases/tag/${tagName}`
    );
  } catch (error) {
    error(`Release failed: ${error.message}`);
  }
}

// Handle async main function
(async () => {
  await main();
})();
