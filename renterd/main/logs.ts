export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG'

export interface DaemonLog {
  timestamp: Date
  level: LogLevel
  source: string
  message: string
  raw: string
}

function stripAnsiCodes(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[\d+m/g, '')
}

export function parseLogLine(line: string): DaemonLog | null {
  try {
    // Strip ANSI color codes
    const cleanLine = stripAnsiCodes(line)

    // Try to parse as structured log first
    const parts = cleanLine.split(/\s+/)

    // Check if it's a structured log (has timestamp and level)
    if (parts[0]?.match(/^\d{4}-\d{2}-\d{2}T/)) {
      if (parts.length < 4) return null

      const timestamp = parts[0]
      const level = parts[1] as LogLevel
      const source = parts[2]
      const message = parts.slice(3).join(' ')

      if (!['INFO', 'ERROR', 'WARN', 'DEBUG'].includes(level)) return null

      return {
        timestamp: new Date(timestamp),
        level,
        source: source.replace(/:$/, ''),
        message,
        raw: cleanLine,
      }
    }

    // Handle error messages
    return {
      timestamp: new Date(),
      level: 'ERROR',
      source: 'daemon',
      message: cleanLine,
      raw: cleanLine,
    }
  } catch (e) {
    console.error('Failed to parse log line:', e)
    return null
  }
}
