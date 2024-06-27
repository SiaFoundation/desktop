/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

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
    postPackage: async (_, { platform, arch }) => {
      if (platform === 'win32' && arch === 'x64') {
        azureSignExecutableFiles('out/renterd-win32-x64')
      }
    },
    postMake: async (_, results) => {
      if (results[0].platform === 'win32' && results[0].arch === 'x64') {
        azureSignExecutableFiles('out/make/squirrel.windows/x64')
      }
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => ({
        // There is currently an issue with deltas.
        // Issue: System.IO.FileNotFoundException: The base package release does not exist
        noDelta: true,
        remoteReleases: `https://releases.sia.tools/renterd/win32/${arch}`,
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
        macUpdateManifestBaseUrl: `https://releases.sia.tools/renterd/darwin/${arch}`,
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
        endpoint: 'https://sia.tools',
        accessKeyId: process.env.RELEASE_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.RELEASE_BUCKET_SECRET_KEY,
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

function azureSignFile(filePath) {
  const args = [
    'sign',
    '-kvu',
    process.env.AZURE_KEY_VAULT_URI,
    '-kvi',
    process.env.AZURE_CLIENT_ID,
    '-kvt',
    process.env.AZURE_TENANT_ID,
    '-kvs',
    process.env.AZURE_CLIENT_SECRET,
    '-kvc',
    process.env.AZURE_CERT_NAME,
    '-tr',
    'http://timestamp.digicert.com',
    '-v',
    filePath,
  ]

  try {
    execFileSync('azuresigntool', args)
    return true
  } catch (error) {
    console.error(`hook error for ${filePath}: ${error.message}`)
    return false
  }
}

function azureSignExecutableFiles(directoryPath) {
  // https://github.com/electron/windows-sign?tab=readme-ov-file#file-types
  const extensions = [
    '.exe',
    '.dll',
    '.sys',
    '.efi',
    '.scr',
    '.node',
    '.msi',
    '.appx',
    '.appxbundle',
    '.msix',
    '.msixbundle',
    '.cat',
    '.cab',
    '.xap',
    '.vbs',
    '.wsf',
    '.ps1',
  ]

  const signedFiles = []
  const skippedFiles = []

  try {
    const files = fs.readdirSync(directoryPath)

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      const fileExtension = path.extname(file).toLowerCase()

      if (extensions.includes(fileExtension)) {
        if (azureSignFile(filePath)) {
          signedFiles.push(file)
        } else {
          skippedFiles.push(file)
        }
      } else {
        skippedFiles.push(file)
      }
    })

    console.log('Files signed:')
    signedFiles.forEach((file) => console.log(`  ${file}`))

    console.log('Files skipped:')
    skippedFiles.forEach((file) => console.log(`  ${file}`))
  } catch (err) {
    console.error(`Unable to scan directory: ${err}`)
    process.exit(1)
  }
}
