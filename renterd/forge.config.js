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
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        arch: ['arm64', 'x64'],
      },
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        arch: ['arm64', 'x64'],
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: {
        arch: ['arm64', 'x64'],
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
        draft: true,
      },
    },
  ],
}
