import fs from 'fs'
import path from 'path'
import { Octokit } from '@octokit/rest'
import admZip from 'adm-zip'
import { getBinaryFilePath, getConfigAndBinaryDirectoryPath } from './config'
import { promisify } from 'util'
import stream from 'stream'
import axios from 'axios'
import { system } from './state'

export async function downloadRelease(): Promise<void> {
  try {
    const octokit = new Octokit()
    const releaseData = await octokit.repos.getLatestRelease({
      owner: 'SiaFoundation',
      repo: 'renterd',
    })

    const release = releaseData.data
    const asset = release.assets.find((asset) => asset.name === releaseAsset())
    console.log(`Downloading ${releaseAsset()}`)

    if (asset) {
      console.log('Release name:', release.name)
      console.log('Release tag:', release.tag_name)
      await downloadFile(asset.browser_download_url)
      extractBinary() // Assuming binary is zipped
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

  const binaryName = system.isWindows ? 'renterd.exe' : 'renterd'
  const extractedBinaryPath = path.join(extractDir, binaryName)
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
  return path.join(getConfigAndBinaryDirectoryPath(), 'download')
}

function getBinaryZipStagingPath(): string {
  const binaryName = process.platform === 'win32' ? `renterd.exe` : `renterd`
  return path.join(getTempDownloadsPath(), binaryName + '.zip')
}

function releaseAsset(): string {
  let goos
  switch (process.platform) {
    case 'win32':
      goos = 'windows'
      break
    case 'darwin':
      goos = 'darwin'
      break
    case 'linux':
      goos = 'linux'
      break
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }

  let goarch
  if (process.platform === 'win32') {
    // Windows only supports amd64
    goarch = 'amd64'
  } else {
    // For Darwin and Linux, consider both amd64 and arm64
    switch (process.arch) {
      case 'x64':
        goarch = 'amd64'
        break
      case 'arm64':
        goarch = 'arm64'
        break
      default:
        throw new Error(`Unsupported architecture: ${process.arch}`)
    }
  }

  return `renterd_${goos}_${goarch}.zip`
}
