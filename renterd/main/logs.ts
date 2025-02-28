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
// 2025-02-28T10:01:33-05:00     INFO    renterd {"version": "v2.0.0", "network": "mainnet", "commit": "0fb4082", "buildDate": "2025-02-18T08:12:30-05:00", "config": "/Users/me/Library/Application Support/renterd/data/config.yaml"}
// 2025-02-28T10:01:33-05:00     INFO    sql     Using SQLite version 3.46.1
// 2025-02-28T10:01:33-05:00     INFO    api: Listening on 127.0.0.1:9980
// 2025-02-28T10:01:33-05:00     INFO    s3: Listening on 127.0.0.1:9985
// 2025-02-28T10:01:33-05:00     INFO    autopilot.autopilot     autopilot is waiting on the bus to connect to peers...
// 2025-02-28T10:01:33-05:00     INFO    bus: Listening on [::]:9981
// 2025-02-28T10:01:34-05:00     INFO    autopilot.autopilot     autopilot loop trigger is scheduled for when the wallet receives a deposit
export function parseLogLine(line: string): DaemonLog | null {
  try {
    // Strip ANSI color codes
    const cleanLine = stripAnsiCodes(line)

    // Simple regex to extract timestamp and level
    const match = cleanLine.match(
      /^(\d{4}-\d{2}-\d{2}T[\d:.-]+)\s+(INFO|ERROR|WARN|DEBUG)/
    )
    if (match) {
      const timestamp = match[1]
      const level = match[2] as LogLevel

      // Get everything after the level
      const rest = cleanLine.substring(match[0].length).trim()

      // Check if there's a source (text followed by a tab)
      const sourceMatch = rest.match(/^(\S+)\t/)
      let source: string | undefined
      let message: string

      if (sourceMatch) {
        source = sourceMatch[1]
        message = rest.substring(sourceMatch[0].length).trim()
      } else {
        source = undefined
        message = rest
      }

      return {
        timestamp: new Date(timestamp),
        level,
        source,
        message,
        raw: cleanLine,
      }
    }

    // Next line of a multi-line log so do not include any metadata.
    return {
      message: cleanLine,
      raw: cleanLine,
    }
  } catch (e) {
    console.error('Failed to parse log line:', e)
    return null
  }
}
