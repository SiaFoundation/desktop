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
// 2025-02-28T09:48:03-05:00     INFO    loaded config file      {"path": "/Users/me/Library/Application Support/walletd/data/config.yaml"}
// 2025-02-28T09:48:03-05:00     INFO    node started    {"network": "mainnet", "syncer": "[::]:10981", "http": "127.0.0.1:10980", "version": "v2.0.0", "commit": "42659f7"}
export function parseLogLine(line: string): DaemonLog | null {
  try {
    // Strip ANSI color codes
    const cleanLine = stripAnsiCodes(line)

    // Check if it's a structured log (has timestamp and level)
    const parts = cleanLine.split(/\s+/)

    // Check if first part is a timestamp
    if (parts[0]?.match(/^\d{4}-\d{2}-\d{2}T/)) {
      if (parts.length < 3) return null

      const timestamp = parts[0]
      const level = parts[1] as LogLevel

      // Combine everything after level as message
      const message = parts.slice(2).join(' ')

      if (!['INFO', 'ERROR', 'WARN', 'DEBUG'].includes(level)) {
        return {
          message: cleanLine,
          raw: cleanLine,
        }
      }

      return {
        timestamp: new Date(timestamp),
        level,
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
