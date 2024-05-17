# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop wrapper for hostd, renterd, and walletd.

### Notes

- Electron has issues with npm and yarn package hoisting across workspaces so the repo is set up as individual projects. Even when setting `nmHoistingLimits`, yarn would still have issues installing electron on Windows.
