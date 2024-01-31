export const system: {
  isDarwin: boolean
  isLinux: boolean
  isWindows: boolean
} = {
  isDarwin: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  isWindows: process.platform === 'win32',
}
