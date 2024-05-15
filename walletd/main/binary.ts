import * as path from 'path'
import { getResourcePath } from './asset'

export function getDaemonDirectoryPath(): string {
  return getResourcePath('daemon')
}

export function getBinaryDirectoryPath(): string {
  return path.join(getDaemonDirectoryPath(), 'bin')
}

export function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? 'walletd.exe' : 'walletd'
  return path.join(getBinaryDirectoryPath(), binaryName)
}
