# Desktop

This is the mono-repo for the Sia Foundation desktop apps. It contains a desktop
wrapper for hostd, renter, and walletd.

### Notes

- The desktop project uses Yarn instead of NPM because Electron Forge requires the Yarn-only `nmHoistingLimits` option for localized node_modules.
