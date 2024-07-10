import * as path from 'path'
import { getResourcePath } from './asset'
import { daemonName } from './constants'

export function getDaemonDirectoryPath(): string {
  return getResourcePath('daemon')
}

export function getBinaryDirectoryPath(): string {
  return path.join(getDaemonDirectoryPath(), 'bin')
}

export function getBinaryFilePath(): string {
  const binaryName =
    process.platform === 'win32' ? `${daemonName}.exe` : daemonName
  return path.join(getBinaryDirectoryPath(), binaryName)
}
