import path from 'path'

export function getResourcePath(name: string) {
  return path.join(process.resourcesPath, name)
}

export function getResourceAsarPath(name: string) {
  return getResourcePath(path.join('app.asar', name))
}

export function getResourceAsarUnpackedPath(name: string) {
  return getResourcePath(path.join('app.asar.unpacked', name))
}

export function getAsset(name: string) {
  return getResourceAsarPath(path.join('assets', name))
}
