export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'

export interface DaemonLog {
  timestamp?: Date
  level?: LogLevel
  source?: string
  message: string
  raw: string
}

function stripAnsiCodes(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[\d+m/g, '')
}

// Example log lines (large spaces are tabs):
// INFO    loaded config file      {"path": "/Users/me/Library/Application Support/hostd/data/config.yaml"}
// INFO    hostd   {"version": "v2.0.4", "network": "mainnet", "commit": "4094916", "buildDate": "2025-02-24T16:26:07-05:00"}
// INFO    node started    {"network": "mainnet", "hostKey": "ed25519:cafbc72cfa7e4c8682dbb861460dd03dbca0b6ed9971d985dbcb3faeab131e6a", "http": "127.0.0.1:9980", "p2p": "[::]:9981", "rhp2": "[::]:9982", "rhp3": "[::]:9983"}
export function parseLogLine(line: string): DaemonLog | null {
  try {
    // Strip ANSI color codes
    const cleanLine = stripAnsiCodes(line)

    // Extract the log level (first word)
    const levelMatch = cleanLine.match(/^(INFO|ERROR|WARN|DEBUG)/)
    if (!levelMatch) {
      // Next line of a multi-line log so do not include any metadata.
      return {
        message: cleanLine,
        raw: cleanLine,
      }
    }

    const level = levelMatch[0] as LogLevel

    // Get the rest of the message after the level
    const message = cleanLine.substring(level.length).trim()

    return {
      level,
      message,
      raw: cleanLine,
    }
  } catch (e) {
    console.error('Failed to parse log line:', e)
    return null
  }
}
