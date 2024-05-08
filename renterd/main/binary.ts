import * as path from 'path'
import { getResourcePath } from './asset'

export function getBinaryDirectoryPath(): string {
  return getResourcePath('bin')
}

export function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? 'renterd.exe' : 'renterd'
  return path.join(getBinaryDirectoryPath(), binaryName)
}
