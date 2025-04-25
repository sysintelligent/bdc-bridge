# BDC CLI Package Management

This directory contains packaging configurations for distributing the BDC CLI tool via Homebrew.

## Table of Contents
- [Formula Management](#formula-management)
  - [Automated Version Updates](#automated-version-updates)
  - [Manual Formula Updates](#manual-formula-updates)
  - [Testing Locally](#testing-locally)
  - [Submitting to Homebrew Core](#submitting-to-homebrew-core)
- [Current Version](#current-version)

## Formula Management

### Automated Version Updates

The `update_version.sh` script automates the process of updating both the local formula and the Homebrew tap repository. It handles:
- Creating and pushing a new Git tag
- Downloading the release tarball
- Calculating the SHA256 hash
- Updating both local and tap formulas
- Committing and pushing changes

To use the script:
```bash
# Make the script executable (if needed)
chmod +x update_version.sh

# Run the script with the new version number
./update_version.sh 1.0.4
```

The script will:
1. Delete any existing tag for the version
2. Create and push a new tag
3. Wait for GitHub to create the release
4. Calculate the SHA256 hash
5. Update both local and tap formulas
6. Commit and push all changes

### Manual Formula Updates

If you need to update the formula manually:

1. Create a new release on GitHub (e.g., v1.0.2)
2. Calculate the SHA256 hash of the release tarball:
   ```bash
   curl -L https://github.com/sysintelligent/bdc-bridge/archive/v1.0.2.tar.gz | shasum -a 256
   ```
3. Update `bdc-cli.rb` with:
   - New version number in the URL
   - New SHA256 hash

### Testing Locally

Test the formula before submitting to Homebrew:

```bash
# Install from the local formula
brew install --build-from-source ./bdc-cli.rb

# Verify installation
bdc-cli version

# Test the dashboard
bdc-cli admin dashboard
```

### Submitting to Homebrew Core

1. Fork homebrew-core repository
2. Create a new branch
3. Add your formula
4. Submit a pull request

## Current Version

The current version in the formula is v1.0.4. See `bdc-cli.rb` for details.