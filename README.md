# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop wrapper for hostd, renterd, and walletd.

## Installation

```sh
# All projects:
bun run install:all
# One project:
bun run install:renterd
bun run install:hostd
bun run install:renterd
```

## Development

```sh
bun run dev:renterd
bun run dev:hostd
bun run dev:renterd
```

### Notes

- Electron has issues with package hoisting across workspaces so the repo is set up without workspaces defined in the root package.json.
