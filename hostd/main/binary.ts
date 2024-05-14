import * as path from 'path'
import { getResourcePath } from './asset'

export function getBinaryDirectoryPath(): string {
  return getResourcePath('daemon/bin')
}

export function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? 'hostd.exe' : 'hostd'
  return path.join(getBinaryDirectoryPath(), binaryName)
}
