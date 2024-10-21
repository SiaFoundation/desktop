# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop wrapper for hostd, renterd, and walletd.

## Installation

```sh
# All projects:
npm run install:all
# One project:
npm run install:renterd
npm run install:hostd
npm run install:renterd
# Manual command:
# Navigate into the specific project directory.
# Always use --workspaces=false to avoid issues with npm hoisting across workspaces.
cd renterd
npm i --workspaces=false
```

## Development

```sh
npm run dev:renterd
npm run dev:hostd
npm run dev:renterd
```

### Notes

- Electron has issues with npm and yarn package hoisting across workspaces so the repo is set up as individual projects. Even when setting `nmHoistingLimits`, yarn would still have issues installing electron on Windows.
