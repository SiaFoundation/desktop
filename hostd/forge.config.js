const { default: MakerDeb } = require('@electron-forge/maker-deb')
const { default: MakerDMG } = require('@electron-forge/maker-dmg')
const { default: MakerRpm } = require('@electron-forge/maker-rpm')
const { default: MakerSquirrel } = require('@electron-forge/maker-squirrel')
const { default: MakerZIP } = require('@electron-forge/maker-zip')
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const makerSquirrel = new MakerSquirrel(
  (arch) => ({
    // There is currently an issue with deltas.
    // Issue: System.IO.FileNotFoundException: The base package release does not exist
    noDelta: true,
    remoteReleases: `https://releases.sia.tools/hostd/win32/${arch}`,
    // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
    iconUrl: 'https://sia.tech/assets/appicon.ico',
    // The ICO file to use as the icon for the generated Setup.exe
    setupIcon: './assets/icons/icon.ico',
  }),
  ['win32']
)
const makerZIP = new MakerZIP(
  (arch) => ({
    macUpdateManifestBaseUrl: `https://releases.sia.tools/hostd/darwin/${arch}`,
    options: {
      icon: './assets/icons/icon.icns',
    },
  }),
  ['darwin']
)
const makerDMG = new MakerDMG(
  (arch) => ({
    name: `hostd-${arch}`,
    icon: './assets/icons/icon.icns',
    format: 'ULFO',
  }),
  ['darwin']
)
const makerDeb = new MakerDeb(
  {
    options: {
      icon: './assets/icons/icon.png',
    },
  },
  ['linux']
)
const makerRPM = new MakerRpm(
  {
    options: {
      icon: './assets/icons/icon.png',
    },
  },
  ['linux']
)

// THIS FIX IS TAKEN FROM: https://github.com/kando-menu/kando/pull/700/files
// > Below comes an evil hack to fix this issue: https://github.com/kando-menu/kando/issues/502
// > For some reason, there seems to be no way to disable the build_id_links feature in the
// > electron-installer-redhat package which is used by electron-forge to create RPM packages.
// > The rpmbuild command is issued here: https://github.com/electron-userland/electron-installer-redhat/blob/main/src/installer.js#L66
// > And we need to pass the "--define _build_id_links none" argument to it. Hence we override the
// > createPackage method of the RedhatInstaller class to add this argument. This is a dirty hack
// > and will most likely break in the future... Does anyone have a better solution?
if (makerRPM.isSupportedOnCurrentPlatform()) {
  const { Installer: RedhatInstaller } = require('electron-installer-redhat')
  const { spawn } = require('@malept/cross-spawn-promise')
  RedhatInstaller.prototype.createPackage = async function () {
    this.options.logger(
      '+++ Running patched createPackage method! See forge.config.ts for details. +++'
    )
    this.options.logger(`Creating package at ${this.stagingDir}`)
    const output = await spawn(
      'rpmbuild',
      [
        '-bb',
        this.specPath,
        '--target',
        `${this.options.arch}-${this.options.vendor}-${this.options.platform}`,
        '--define',
        `_topdir ${this.stagingDir}`,
        '--define', // Here is the important part:
        '_build_id_links none', // This is the argument we need to add.
      ],
      this.options.logger
    )
    this.options.logger(`rpmbuild output: ${output}`)
  }
}

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
        azureSignExecutableFiles('out/hostd-win32-x64')
      }
    },
    postMake: async (_, results) => {
      if (results[0].platform === 'win32' && results[0].arch === 'x64') {
        azureSignExecutableFiles('out/make/squirrel.windows/x64')
      }
    },
  },
  makers: [makerSquirrel, makerZIP, makerDMG, makerDeb, makerRPM],
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
        tagPrefix: 'hostd@',
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
