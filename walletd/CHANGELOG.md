# walletd

## 0.17.0

### Minor Changes

- 5eed38b: The daemon version has been updated to v2.8.0.

## 0.16.0

### Minor Changes

- 5b648d0: The daemon version has been updated to v2.2.1.

## 0.15.1

### Patch Changes

- 755131b: Fixed an issue in the build process where a network issue could result in a missing binary.

## 0.15.0

### Minor Changes

- 3153ef8: Double-click to copy a log line.
- 3153ef8: The exact log parsing was refined.

### Patch Changes

- 9b42b9f: Fixed an issue where the windows binary was not being moved to the correct location.

## 0.14.0

### Minor Changes

- b29eddb: The edge of the log viewer can be dragged to expand or shrink the viewer height.
- b29eddb: There is now a log viewer in the configuration window.
- b29eddb: The log viewer has actions for toggling the viewer, clearing the log, opening the actual log file.
- b29eddb: Errors generated in the UI are now also added to the logs in the log viewer for persistence and better visibility.
- b29eddb: Error toasts now use the full error message.

## 0.13.0

### Minor Changes

- 6154a03: The daemon version has been updated to v2.0.0.

## 0.12.2

### Patch Changes

- cc55d3b: Fixed an issue with the publishing workflow that meant some app configuration was not being applied.

## 0.12.1

### Patch Changes

- fda943f: The RPM package now does not contain the debug information in `/usr/lib/.build-id` anymore. This should avoid any conflicts with other Electron-based applications. Closes https://github.com/SiaFoundation/desktop/issues/99

## 0.12.0

### Minor Changes

- 6738170: The macOS releases now include both ARM64 and AMD64 dmgs, named with the following pattern: daemon-arch.dmg.

## 0.11.0

### Minor Changes

- 705f6c2: publish amd64 macOS

## 0.10.0

### Minor Changes

- 546f45f: The advanced configuration options now include setting a custom HTTP address.

## 0.9.0

### Minor Changes

- 7aedd89: Fixed an issue where the app would crash because it was using the old configuration format.

## 0.8.0

### Minor Changes

- 3829177: The daemon version has been updated to v0.8.0.

## 0.7.1

### Patch Changes

- c3d0772: The tray icon now matches the system theme on MacOS. Closes https://github.com/SiaFoundation/desktop/issues/79
- ae8dbe0: The bootstrap option now defaults to true.

## 0.7.0

### Minor Changes

- d11bb66: The desktop app is now running with daemon v0.8.0-beta.1.

### Patch Changes

- 4095c36: Fixed an issue where the tray icon tooltip displayed the wrong app name.

## 0.6.0

### Minor Changes

- ad06c11: Releases are now published to the changeset generated release.

## 0.5.0

### Minor Changes

- 666b563: Releases now publish a dmg for MacOS. Closes https://github.com/SiaFoundation/desktop/issues/65

## 0.4.0

### Minor Changes

- 1013fdd: The user experience around recovery phrase generation and re-generation has been refined.

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
