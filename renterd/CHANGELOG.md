# renterd

## 0.35.0

### Minor Changes

- 348fd3b: The daemon version has been updated to v2.8.1.

## 0.34.0

### Minor Changes

- ffc5eb0: The menu bar is now hidden by default on Windows and Linux. Closes https://github.com/SiaFoundation/walletd/issues/199

### Patch Changes

- 8824529: Updated Next.js to 15.4.8.

## 0.33.0

### Minor Changes

- 561b54c: The daemon version has been updated to v2.7.1.

## 0.32.0

### Minor Changes

- dd83fe2: The daemon version has been updated to v2.7.0.

## 0.31.0

### Minor Changes

- 30a6fcb: The daemon version has been updated to v2.6.0.

## 0.30.0

### Minor Changes

- d5eb31e: Updated dependencies.

## 0.29.0

### Minor Changes

- 3df2244: The daemon version has been updated to v2.5.0.

## 0.28.0

### Minor Changes

- 14aed18: The daemon version has been updated to v2.4.0.

## 0.27.0

### Minor Changes

- e9bf430: The daemon version has been updated to v2.3.3.

## 0.26.0

### Minor Changes

- 164b84c: The daemon version has been updated to v2.3.1.

## 0.25.0

### Minor Changes

- 7b71981: The daemon version has been updated to v2.3.0.
- 0641421: The app icons have been updated.

## 0.24.0

### Minor Changes

- 5c51082: The daemon version has been updated to v2.2.1.

## 0.23.0

### Minor Changes

- 8fd339b: The daemon version has been updated to v2.2.0.

## 0.22.0

### Minor Changes

- a74cc59: The daemon version has been updated to v2.0.1.

### Patch Changes

- 755131b: Fixed an issue in the build process where a network issue could result in a missing binary.

## 0.21.0

### Minor Changes

- 3153ef8: Double-click to copy a log line.
- 3153ef8: The exact log parsing was refined.

### Patch Changes

- 9b42b9f: Fixed an issue where the windows binary was not being moved to the correct location.

## 0.20.0

### Minor Changes

- b29eddb: The edge of the log viewer can be dragged to expand or shrink the viewer height.
- b29eddb: There is now a log viewer in the configuration window.
- b29eddb: The log viewer has actions for toggling the viewer, clearing the log, opening the actual log file.
- b29eddb: Errors generated in the UI are now also added to the logs in the log viewer for persistence and better visibility.
- b29eddb: Error toasts now use the full error message.

## 0.19.0

### Minor Changes

- 8187b01: The daemon version has been updated to v2.0.0.

## 0.18.0

### Minor Changes

- 5e7eb7c: The daemon version has been updated to v1.1.1.

## 0.17.2

### Patch Changes

- cc55d3b: Fixed an issue with the publishing workflow that meant some app configuration was not being applied.

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
