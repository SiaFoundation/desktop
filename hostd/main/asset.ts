import electronIsDev from 'electron-is-dev'
import path from 'path'

export function getResourcePath(name: string) {
  if (electronIsDev) {
    return path.join(process.cwd(), name)
  }
  return path.join(process.resourcesPath, name)
}

export function getResourceAsarPath(name: string) {
  if (electronIsDev) {
    return path.join(process.cwd(), name)
  }
  return getResourcePath(path.join('app.asar', name))
}

export function getResourceAsarUnpackedPath(name: string) {
  if (electronIsDev) {
    return path.join(process.cwd(), name)
  }
  return getResourcePath(path.join('app.asar.unpacked', name))
}

export function getAsset(name: string) {
  return getResourceAsarPath(path.join('assets', name))
}
