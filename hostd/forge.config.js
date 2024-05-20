const { execSync } = require('child_process')

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
    extraResource: ['daemon'],
    icon: './assets/icons/icon',
  },
  rebuildConfig: {},
  hooks: {
    postPackage: async (_, { plaform }) => {
      if (plaform === 'win32') {
        const command = `
        BINARY_PATH="out/hostd-win32-x64/hostd.exe"
        azuresigntool sign \
          -kvu "${process.env.AZURE_KEY_VAULT_URI}" \
          -kvi "${process.env.AZURE_CLIENT_ID}" \
          -kvt "${process.env.AZURE_TENANT_ID}" \
          -kvs "${process.env.AZURE_CLIENT_SECRET}" \
          -kvc "${process.env.AZURE_CERT_NAME}" \
          -tr http://timestamp.digicert.com \
          -v $BINARY_PATH
      `
        try {
          const output = execSync(command, { stdio: 'inherit' })
          console.log('postPackage hook output:', output?.toString())
        } catch (error) {
          console.error(`postPackage hook error: ${error.message}`)
          process.exit(1)
        }
      }
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => ({
        // Only needs to be set to true for first publish ever.
        // noDelta: true,
        remoteReleases: `https://releases.s3.sia.tools/hostd/win32/${arch}`,
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        iconUrl: 'https://sia.tech/assets/appicon.ico',
        // The ICO file to use as the icon for the generated Setup.exe
        setupIcon: './assets/icons/icon.ico',
      }),
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: (arch) => ({
        macUpdateManifestBaseUrl: `https://releases.s3.sia.tools/hostd/darwin/${arch}`,
        options: {
          icon: './assets/icons/icon.icns',
        },
      }),
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          icon: './assets/icons/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
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
        bucket: 'releases',
        endpoint: 'https://s3.sia.tools',
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
