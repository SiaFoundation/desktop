module.exports = {
  packagerConfig: {
    asar: true,
    osxSign: {}, // object must exist even if empty
    osxNotarize: {
      tool: 'notarytool',
      appleApiKey: process.env.APPLE_API_KEY_PATH,
      appleApiKeyId: process.env.APPLE_API_KEY,
      appleApiIssuer: process.env.APPLE_API_ISSUER,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        arch: ['x64'],
        options: {
          icon: './icons/win/icon.ico',
        },
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        arch: ['arm64', 'x64'],
        options: {
          icon: './icons/mac/icon.icns',
        },
      },
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        arch: ['arm64', 'x64'],
        options: {
          icon: './icons/png/512x512.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: {
        arch: ['arm64', 'x64'],
        options: {
          icon: './icons/png/512x512.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'SiaFoundation',
          name: 'desktop',
        },
        prerelease: false,
        draft: false,
      },
    },
  ],
}
