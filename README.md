# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop wrapper for hostd, renterd, and walletd.

### Notes

- Electron has issues with npm and yarn package hoisting across workspaces so the repo is set up as individual projects with no root package.json. Even when setting `nmHoistingLimits`, yarn would still have issues installing electron on Windows.
- The `release.json` file is copied to `package.json` in the release CI action so that we can use changesets which rely on npm workspace projects.
