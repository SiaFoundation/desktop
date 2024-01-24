import { ChildProcess } from 'child_process'

export let state: {
  process: ChildProcess | null
} = {
  process: null,
}
