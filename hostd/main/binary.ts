import * as path from 'path'
import { env } from './env'

export function getBinaryDirectoryPath(): string {
  return env.isDev
    ? path.join(process.cwd(), 'bin')
    : path.join(__dirname, '../bin')
}

export function getBinaryFilePath(): string {
  const binaryName = process.platform === 'win32' ? 'hostd.exe' : 'hostd'
  return path.join(getBinaryDirectoryPath(), binaryName)
}
