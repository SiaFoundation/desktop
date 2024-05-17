# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop wrapper for hostd, renterd, and walletd.

## Installation

```sh
# Navigate into the specific project directory.
# Always use --workspaces=false to avoid issues with yarn hoisting across workspaces.
cd renterd
npm i --workspaces=false
```

### Notes

- Electron has issues with npm and yarn package hoisting across workspaces so the repo is set up as individual projects. Even when setting `nmHoistingLimits`, yarn would still have issues installing electron on Windows.
