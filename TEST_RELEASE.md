# Semantic Release Test

This file is created to test the semantic-release automation workflow.

## Test Details

- **Branch:** feat/semantic-release
- **Expected Version Bump:** MINOR (due to feat: commit)
- **Date:** 2026-02-06

## What This Tests

1. Conventional commit message parsing
2. Automatic version calculation
3. CHANGELOG.md generation
4. gradle.properties version update
5. GitHub release creation
6. Git tag creation

## Expected Outcome

When semantic-release runs, it should:
- Calculate next version based on commits since v0.0.1
- Generate release notes from conventional commits
- Update gradle.properties with new version
- Create a GitHub release
- Create a git tag

---

**Note:** This is a test file and can be removed after successful validation.
