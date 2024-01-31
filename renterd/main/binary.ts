import * as path from 'path'

export function getBinaryDirectoryPath(): string {
  return path.join(__dirname, '../bin')
}

export function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? 'renterd.exe' : 'renterd'
  return path.join(getBinaryDirectoryPath(), binaryName)
}
