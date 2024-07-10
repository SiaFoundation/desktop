# renterd

## 0.11.1

### Patch Changes

- 4095c36: Fixed an issue where the tray icon tooltip displayed the wrong app name.

## 0.11.0

### Minor Changes

- ad06c11: Releases are now published to the changeset generated release.

## 0.10.0

### Minor Changes

- 666b563: Releases now publish a dmg for MacOS. Closes https://github.com/SiaFoundation/desktop/issues/65

## 0.9.0

### Minor Changes

- 1013fdd: The user experience around recovery phrase generation and re-generation has been refined.

## 0.8.0

### Minor Changes

- 27b5268: Releases and automatic updates are now served from releases.sia.tools.
- 27b5268: Windows builds are now signed. Closes https://github.com/SiaFoundation/desktop/issues/59 Closes https://github.com/SiaFoundation/walletd/issues/71

## 0.7.0

### Minor Changes

- fe8a7dc: Left-clicking the tray icon on Windows and Linux now opens or focuses the main window.
- 171b56c: Starting and stopping the daemon now has more feedback with a loading state and error toasts.
- 6cce428: The daemon version has been updated to v1.0.7.

### Patch Changes

- c51356f: Fixed an issue where multiple instances of the app could be started on Windows.

## 0.6.2

### Patch Changes

- 96e1df4: Windows apps are now signed.

## 0.6.1

### Patch Changes

- f2ff4d4: Added Windows signing to CI flow.

## 0.6.0

### Minor Changes

- 1229e94: Added a tooltip to the form change count.
- 1229e94: The auto open web UI configuration option is now available.
- 0071523: The open button now always shows, but is disabled if the daemon is not running.
- 0071523: The onboarding copy is now more clear about the launcher vs the full user interface.
