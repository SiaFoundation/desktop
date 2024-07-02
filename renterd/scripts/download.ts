import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import admZip from 'adm-zip'
import { promisify } from 'util'
import stream from 'stream'
import axios from 'axios'

const daemon = 'renterd'
type Goos = 'darwin' | 'linux' | 'windows'
type Goarch = 'amd64' | 'arm64'
const args = process.argv.slice(2)
let goos = args.find((arg) => arg.startsWith('--goos='))?.split('=')[1] as Goos
let goarch = args
  .find((arg) => arg.startsWith('--goarch='))
  ?.split('=')[1] as Goarch
const auto = !!args.find((arg) => arg.startsWith('--auto'))

if (auto) {
  if (process.platform === 'win32') {
    goos = 'windows'
  } else if (process.platform === 'darwin') {
    goos = 'darwin'
  } else if (process.platform === 'linux') {
    goos = 'linux'
  } else {
    throw new Error('Unsupported platform')
  }
  if (process.arch === 'arm64') {
    goarch = 'arm64'
  } else if (process.arch === 'x64') {
    goarch = 'amd64'
  } else {
    throw new Error('Unsupported architecture')
  }
}

const valid = auto || (goos && goarch)

if (!valid) {
  console.error(
    'Script requires either --auto or --goos=<goos> --goarch=<goarch>'
  )
  process.exit(1)
}

downloadRelease()

async function downloadRelease(): Promise<void> {
  try {
    const versionFilePath = path.join(getDaemonDirectoryPath(), 'version')
    const tag = fs.readFileSync(versionFilePath, { encoding: 'utf8' }).trim()

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })
    const releaseData = await octokit.repos.getReleaseByTag({
      owner: 'SiaFoundation',
      repo: daemon,
      tag,
    })

    const release = releaseData.data
    const asset = release.assets.find((asset) => asset.name === releaseAsset())
    console.log(`Downloading ${releaseAsset()}`)

    if (asset) {
      console.log('Release name:', release.name)
      console.log('Release tag:', release.tag_name)
      await downloadFile(asset.browser_download_url)
      await extractBinary()
    } else {
      throw new Error('Failed to find release asset')
    }
  } catch (err) {
    console.error('Failed to download release:', err)
  }
}

async function downloadFile(url: string): Promise<void> {
  const zipFilePath = getBinaryZipStagingPath()
  await fs.promises.mkdir(getTempDownloadsPath(), { recursive: true })

  // axios response will be a stream
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  })
  const fileWriter = fs.createWriteStream(zipFilePath)

  // Use stream.pipeline to properly handle the stream and errors
  const pipeline = promisify(stream.pipeline)
  await pipeline(response.data, fileWriter)
}

async function extractBinary(): Promise<void> {
  const zipFilePath = getBinaryZipStagingPath()
  const extractDir = getTempDownloadsPath()

  const zip = new admZip(zipFilePath)
  zip.extractAllTo(extractDir, true)

  const binaryName = system.isWindows ? `${daemon}.exe` : daemon
  // For some reason the renterd Windows binary has a bin directory
  // inside the zip file
  const extractedBinaryPath = system.isWindows
    ? path.join(extractDir, 'bin', binaryName)
    : path.join(extractDir, binaryName)
  const finalBinaryPath = getBinaryFilePath()

  await fs.promises.mkdir(path.dirname(finalBinaryPath), { recursive: true })

  // Move the binary to the desired location
  await fs.promises.rename(extractedBinaryPath, finalBinaryPath)

  // Set executable permissions for non-Windows platforms
  if (process.platform !== 'win32') {
    await fs.promises.chmod(finalBinaryPath, '755')
  }

  // Cleanup
  fs.rmSync(extractDir, {
    recursive: true,
    force: true,
  })
}

function getTempDownloadsPath(): string {
  return path.join(getBinaryDirectoryPath(), 'download')
}

function getBinaryZipStagingPath(): string {
  return path.join(getTempDownloadsPath(), daemon + '.zip')
}

function releaseAsset(): string {
  return `${daemon}_${goos}_${goarch}.zip`
}

function getDaemonDirectoryPath(): string {
  // running from dist/main/download.ts
  return path.join(__dirname, '../../daemon')
}

function getBinaryDirectoryPath(): string {
  return path.join(getDaemonDirectoryPath(), 'bin')
}

function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? `${daemon}.exe` : daemon
  return path.join(getBinaryDirectoryPath(), binaryName)
}

const system: {
  isDarwin: boolean
  isLinux: boolean
  isWindows: boolean
} = {
  isDarwin: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  isWindows: process.platform === 'win32',
}
