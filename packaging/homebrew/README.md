# BDC CLI Package Management

This directory contains packaging configurations for distributing the BDC CLI tool via Homebrew.

## Formula Management

### Updating the Formula

When releasing a new version:

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

The current version in the formula is v1.0.1. See `bdc-cli.rb` for details. 