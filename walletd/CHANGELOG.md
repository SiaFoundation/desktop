# walletd

## 0.3.0

### Minor Changes

- 27b5268: Releases and automatic updates are now served from releases.sia.tools.
- 27b5268: Windows builds are now signed. Closes https://github.com/SiaFoundation/desktop/issues/59 Closes https://github.com/SiaFoundation/walletd/issues/71

## 0.2.0

### Minor Changes

- fe8a7dc: Left-clicking the tray icon on Windows and Linux now opens or focuses the main window.
- 171b56c: Starting and stopping the daemon now has more feedback with a loading state and error toasts.

### Patch Changes

- c51356f: Fixed an issue where multiple instances of the app could be started on Windows.

## 0.1.2

### Patch Changes

- 96e1df4: Windows apps are now signed.

## 0.1.1

### Patch Changes

- f2ff4d4: Added Windows signing to CI flow.

## 0.1.0

### Minor Changes

- 1229e94: Added a tooltip to the form change count.
- 1229e94: The auto open web UI configuration option is now available.
- 0071523: The open button now always shows, but is disabled if the daemon is not running.
- 0071523: The onboarding copy is now more clear about the launcher vs the full user interface.
- 0071523: There is now a walletd desktop app.
