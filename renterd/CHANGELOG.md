# renterd

## 0.17.1

### Patch Changes

- fda943f: The RPM package now does not contain the debug information in `/usr/lib/.build-id` anymore. This should avoid any conflicts with other Electron-based applications. Closes https://github.com/SiaFoundation/desktop/issues/99

## 0.17.0

### Minor Changes

- 3c3b5ff: The daemon version has been updated to v1.1.0.

## 0.16.0

### Minor Changes

- 6738170: The macOS releases now include both ARM64 and AMD64 dmgs, named with the following pattern: daemon-arch.dmg.

## 0.15.0

### Minor Changes

- 705f6c2: publish amd64 macOS

## 0.14.0

### Minor Changes

- 546f45f: The advanced configuration options now include setting a custom HTTP address.

## 0.13.0

### Minor Changes

- 223bb9b: The daemon version has been updated to v1.0.8.

## 0.12.0

### Minor Changes

- 009fdc6: The recovery phrase is now displayed in a locked state if a saved value exists. Closes https://github.com/SiaFoundation/desktop/issues/67
- 009fdc6: Recovery phrase and password visibility selections no longer persist between app start, they now reset to hidden.
- 009fdc6: Regenerating the recovery phrase now warns the user and asks for confirmation. Closes https://github.com/SiaFoundation/desktop/issues/67

### Patch Changes

- c3d0772: The tray icon now matches the system theme on MacOS. Closes https://github.com/SiaFoundation/desktop/issues/79
- 009fdc6: Copying the recovery phrase value is now only required if the value has changed.

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
