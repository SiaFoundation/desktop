import path from 'path'
import { system } from './state'

export function getAsset(name: string) {
  return system.isDev
    ? path.join(process.cwd(), 'assets', name)
    : path.join(__dirname, '../assets', name)
}
