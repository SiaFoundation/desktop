import path from 'path'
import { env } from './env'

export function getAsset(name: string) {
  return env.isDev
    ? path.join(process.cwd(), 'assets', name)
    : path.join(__dirname, '../assets', name)
}
