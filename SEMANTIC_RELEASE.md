# Semantic Release Setup for OB Erasmus Reveals

This project uses **semantic-release** for automated versioning, changelog generation, and GitHub releases.

## Overview

semantic-release automates the entire release workflow:
1. Analyzes commit messages since the last release
2. Determines the next semantic version (MAJOR.MINOR.PATCH)
3. Generates a changelog from commits
4. Updates `gradle.properties` with the new version
5. Builds and publishes artifacts to Nexus
6. Creates a GitHub release with release notes
7. Creates a git tag

## Requirements

### Node.js and npm
semantic-release runs on Node.js. Install dependencies before releasing:

```bash
npm install
```

### Conventional Commits

**IMPORTANT:** All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

#### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Examples

**Patch Release (1.0.0 → 1.0.1):**
```bash
git commit -m "fix: correct button alignment on dashboard"
git commit -m "fix(auth): resolve token expiration issue"
```

**Minor Release (1.0.0 → 1.1.0):**
```bash
git commit -m "feat: add email notification system"
git commit -m "feat(api): add user profile endpoint"
```

**Major Release (1.0.0 → 2.0.0):**
```bash
git commit -m "feat!: redesign authentication flow

BREAKING CHANGE: The old login endpoint /auth/login has been removed. Use /api/v2/auth instead."
```

#### Commit Types

- `fix:` - Bug fix (PATCH bump)
- `feat:` - New feature (MINOR bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (MAJOR bump)
- `docs:` - Documentation changes (no version bump)
- `style:` - Code style changes (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `perf:` - Performance improvements (PATCH bump)
- `test:` - Test updates (no version bump)
- `chore:` - Build/tooling changes (no version bump)

## Local Testing

Test the release process without making actual changes:

```bash
# Dry-run mode (no changes made)
npx semantic-release --dry-run

# Dry-run with detailed output
npx semantic-release --dry-run --debug
```

## CI/CD Integration

### Jenkins Pipeline

semantic-release should run automatically in CI after merging to `main`/`master` branch:

```groovy
pipeline {
  agent any
  tools {
    nodejs "node-lts"
  }
  environment {
    GH_TOKEN = credentials('github-token')
    NEXUS_USERNAME = credentials('nexus-username')
    NEXUS_PASSWORD = credentials('nexus-password')
  }
  stages {
    stage('Test') {
      steps {
        sh './gradlew test'
      }
    }
    stage('Release') {
      when { branch 'main' }
      steps {
        sh 'npm ci'
        sh 'npx semantic-release'
      }
    }
  }
}
```

### Required Environment Variables

- `GH_TOKEN` or `GITHUB_TOKEN` - GitHub personal access token with `repo` scope
- `NEXUS_USERNAME` - Nexus repository username
- `NEXUS_PASSWORD` - Nexus repository password
- `nexus.url` - System property for Nexus URL

## Configuration Files

### `.releaserc.json`

Main semantic-release configuration:
- Defines release branches (`main`, `master`)
- Configures plugins for commit analysis, changelog, Git updates, GitHub releases
- Sets up Gradle build and publish commands

### `package.json`

Defines semantic-release and plugin dependencies.

### `gradle.properties`

Contains the current version. **Automatically updated by semantic-release** - do not manually edit.

## Workflow Example

1. Developer makes changes and commits using conventional format:
   ```bash
   git commit -m "feat: add user export functionality"
   ```

2. Developer pushes to `main` branch (or merges PR):
   ```bash
   git push origin main
   ```

3. CI/CD pipeline runs and semantic-release:
   - Analyzes commits since last tag
   - Determines this is a MINOR release
   - Updates version from `1.2.3` to `1.3.0` in `gradle.properties`
   - Generates CHANGELOG.md entry
   - Runs `./gradlew build`
   - Publishes artifact to Nexus
   - Creates GitHub release with notes
   - Creates git tag `v1.3.0`
   - Commits updated files with message `chore(release): 1.3.0 [skip ci]`

## Troubleshooting

### "No release published"

This means no commits since the last release triggered a version bump. Ensure commits use proper types (`fix:`, `feat:`, etc.).

### "ENOCHANGE: No release published"

The commits since last release don't warrant a new version (e.g., only `docs:` or `chore:` commits).

### Build fails during release

Check Gradle build logs. semantic-release runs `./gradlew build` during the prepare step.

### Cannot push to repository

Ensure `GH_TOKEN` has sufficient permissions and the CI user can push to the repository.

## Migration from Axion

This project was migrated from `axion-release-plugin` to `semantic-release`. Key changes:

- **Before:** Version calculated from git tags, manual version decisions
- **After:** Version calculated from conventional commits, fully automated

## Resources

- [semantic-release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [semantic-release GitHub Plugin](https://github.com/semantic-release/github)
- [gradle-semantic-release-plugin](https://github.com/KengoTODA/gradle-semantic-release-plugin)
