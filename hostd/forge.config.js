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
    icon: './assets/icons/icon',
  },
  rebuildConfig: {},
  hooks: {
    postMake: async (config, makeResults) => {
      makeResults?.forEach((result) => {
        console.log('POST MAKE')
        console.log(result.arch)
        console.log(result.platform)
        console.log(result.artifacts)
        result.artifacts?.forEach((artifact) => {
          console.log(artifact)
        })
      })
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      // arch: ['x64'],
      config: (arch) => ({
        remoteReleases: `https://public.s3.file.dev/hostd/win32/${arch}`,
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        iconUrl: 'https://sia.tech/assets/appicon.ico',
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: './assets/icons/icon.ico',
      }),
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      // arch: ['arm64', 'x64'],
      config: (arch) => ({
        macUpdateManifestBaseUrl: `https://public.s3.file.dev/hostd/darwin/${arch}`,
        options: {
          icon: './assets/icons/icon.icns',
        },
      }),
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      // arch: ['arm64', 'x64'],
      config: {
        options: {
          icon: './assets/icons/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      // arch: ['arm64', 'x64'],
      config: {
        options: {
          icon: './assets/icons/icon.png',
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
      name: '@electron-forge/publisher-s3',
      config: {
        public: true,
        region: 'us-east-1',
        bucket: 'public',
        endpoint: 'https://s3.file.dev',
        accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
      },
    },
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
