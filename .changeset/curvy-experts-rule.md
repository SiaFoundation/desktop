---
'hostd': patch
'renterd': patch
'walletd': patch
---

The RPM package now does not contain the debug information in `/usr/lib/.build-id` anymore. This should avoid any conflicts with other Electron-based applications. Closes https://github.com/SiaFoundation/desktop/issues/99
