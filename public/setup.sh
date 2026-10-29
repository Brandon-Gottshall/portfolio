#!/bin/bash
# Public entrypoint only. The profile and installer remain in the private repository.
set +x
set -euo pipefail
[ "$(uname -s)" = Darwin ] || { echo 'This setup requires macOS.' >&2; exit 1; }
[ "$(id -u)" -ne 0 ] || { echo 'Run as your normal Mac user, not sudo.' >&2; exit 1; }
# curl | bash leaves stdin attached to a pipe; interactive consent must use the terminal.
exec 3<>/dev/tty || { echo 'Open Terminal and run this command interactively.' >&2; exit 1; }
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v brew >/dev/null 2>&1; then
  echo 'Installing Homebrew so GitHub browser sign-in can run.'
  installer=$(mktemp -t thin-mac-homebrew)
  trap 'rm -f "$installer"' EXIT
  curl --fail --silent --show-error --location --proto '=https' https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh -o "$installer"
  /bin/bash "$installer" <&3
  rm -f "$installer"
  trap - EXIT
fi
if ! command -v gh >/dev/null 2>&1; then brew install gh <&3; fi
echo 'Step 1: connect GitHub in your browser.'
if ! gh auth status --active --hostname github.com >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol https --web --clipboard <&3
fi
gh auth setup-git --hostname github.com
# Fail before private fetch if this account cannot access the repository.
gh repo view Brandon-Gottshall/nix-config --json nameWithOwner >/dev/null
echo 'GitHub connected. Installing your private Mac setup app.'
brew tap brandon-gottshall/thin-macos-config https://github.com/Brandon-Gottshall/nix-config.git <&3
# Keep existing Keychain credentials in memory only for Homebrew's isolated fetch.
HOMEBREW_GIT=/usr/bin/git HOMEBREW_GITHUB_API_TOKEN="$(gh auth token --hostname github.com)" brew install --build-from-source brandon-gottshall/thin-macos-config/thin-macos-config <&3
thin-macos-config
echo 'Thin Mac Setup is open. Choose apps there; complete sign-ins and macOS permissions when requested.'
