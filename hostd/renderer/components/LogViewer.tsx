'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Panel,
  Button,
  ScrollArea,
  copyToClipboard,
  Text,
} from '@siafoundation/design-system'
import {
  Reset16,
  ChevronUp16,
  ChevronDown16,
  Launch16,
} from '@siafoundation/react-icons'
import useSWR from 'swr'
import { LogLevel } from '../../main/logs'
import { cx } from 'class-variance-authority'

const defaultHeight = 400
const storageKey = 'logViewerHeight'

const levelColors: Record<LogLevel, string> = {
  INFO: 'text-green-500',
  ERROR: 'text-red-500',
  WARN: 'text-amber-500',
  DEBUG: 'text-blue-500',
}

export function LogViewer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [height, setHeight] = useState(() => {
    if (typeof window === 'undefined') return defaultHeight
    const saved = window.localStorage.getItem(storageKey)
    return saved ? parseInt(saved, 10) : defaultHeight
  })
  const [dragOffset, setDragOffset] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)

  const { data: logs = [], mutate } = useSWR(
    'daemon-logs',
    () => window.electron.getDaemonLogs(),
    {
      refreshInterval: 1000,
    }
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const dy = startYRef.current - e.clientY
      setDragOffset(dy)
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      document.body.style.cursor = 'default'

      const newHeight = Math.min(
        Math.max(200, startHeightRef.current + dragOffset),
        window.innerHeight * 0.9
      )
      setHeight(newHeight)
      window.localStorage.setItem(storageKey, String(newHeight))
      setDragOffset(0)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragOffset])

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    startYRef.current = e.clientY
    startHeightRef.current = height
    document.body.style.cursor = 'row-resize'
  }

  const clearLogs = async () => {
    await window.electron.clearDaemonLogs()
    mutate()
  }

  const openLogFile = async () => {
    await window.electron.openLogFile()
  }

  const currentHeight = isExpanded ? height + dragOffset : 40

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        height: currentHeight,
        transition: isDraggingRef.current ? 'none' : 'height 0.3s ease',
      }}
    >
      {isExpanded && (
        <div
          ref={dragRef}
          className="absolute top-0 left-0 right-0 h-1 cursor-row-resize bg-gray-800 hover:bg-accent-500 transition-colors"
          onMouseDown={startDragging}
        />
      )}
      <Panel className="h-full flex flex-col rounded-b-none">
        <div
          className={`flex items-center gap-2 px-2 ${
            isExpanded ? 'py-2' : 'py-1.5'
          } select-none`}
        >
          <div className="text-sm font-medium">Logs</div>
          <div className="flex-1" />
          {isExpanded && (
            <>
              <Button
                variant="gray"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  clearLogs()
                }}
              >
                <Reset16 />
                clear view
              </Button>
              <Button
                variant="gray"
                size="small"
                className="text-xs gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                  openLogFile()
                }}
              >
                <Launch16 />
                open file
              </Button>
            </>
          )}
          <div className="w-px h-3 bg-gray-800/50" />
          <Button
            variant="gray"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse logs' : 'Expand logs'}
          >
            {isExpanded ? <ChevronDown16 /> : <ChevronUp16 />}
          </Button>
        </div>

        {isExpanded ? (
          logs.length > 0 ? (
            <ScrollArea ref={scrollRef} className="flex-1">
              <table className="w-full border-collapse font-mono text-xs relative">
                <thead>
                  <tr
                    className={cx('z-10 text-xs sticky top-0', [
                      'bg-white dark:bg-graydark-200',
                      'shadow-border-b shadow-gray-400 dark:shadow-graydark-400',
                    ])}
                  >
                    <th className="px-2 py-1.5 text-left font-medium">Time</th>
                    <th className="px-2 py-1.5 text-left font-medium">Level</th>
                    <th className="px-2 py-1.5 text-left font-medium">
                      Source
                    </th>
                    <th className="px-2 py-1.5 text-left font-medium">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr
                      key={i}
                      className={cx(
                        'hover:bg-gray-200 dark:hover:bg-graydark-400',
                        'transition-colors'
                      )}
                      onDoubleClick={() => copyToClipboard(log.raw, 'log')}
                    >
                      <td className="px-2 py-1 whitespace-nowrap opacity-50">
                        {log.timestamp?.toLocaleTimeString()}
                      </td>
                      <td
                        className={`px-2 py-1 whitespace-nowrap font-semibold ${
                          log.level ? levelColors[log.level] : ''
                        }`}
                      >
                        {log.level}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap opacity-75">
                        {log.source}
                      </td>
                      <td className="px-2 py-1">
                        <div className="whitespace-pre">{log.message}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          ) : (
            <div className="flex flex-col h-full items-center justify-center">
              <Text size="16" color="verySubtle">
                No logs
              </Text>
            </div>
          )
        ) : null}
      </Panel>
    </div>
  )
}
