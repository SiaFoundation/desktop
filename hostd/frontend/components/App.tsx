'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  GenerateSeed,
  NeedsConfig,
  SaveConfig,
  StartDaemon,
} from '../wailsjs/go/main/App.js'
import { EventsOn } from '../wailsjs/runtime/runtime.js'
import { TextField } from '@siafoundation/design-system'

const defaultConfig = {
  dataDir: '',
  recoveryPhrase: '',
  http: {
    address: 'localhost:9980',
    password: '',
  },
  consensus: {
    bootstrap: true,
    gatewayAddress: ':9981',
  },
  rhp2: {
    address: ':9982',
  },
  rhp3: {
    tcp: ':9983',
    websocket: ':9984',
  },
  log: {
    level: 'info',
  },
}

type Config = typeof defaultConfig

// async function generateSeed() {
// 	console.log('Generating seed...');
// 	config.value.recoveryPhrase = await GenerateSeed();
// }

// (() => {
// 	EventsOn('process', (e) => {
// 		console.log(e);
// 	});
// 	console.log('registed process event');
// })()

export function App() {
  const [error, setError] = useState<string>()
  const [isConfigured, setIsConfigured] = useState(false)
  const [config, setConfig] = useState<Config>(defaultConfig)

  useEffect(() => {
    const checkIfConfigured = async () => {
      setIsConfigured(!(await NeedsConfig()))
    }
    checkIfConfigured()
  }, [])

  const save = useCallback(async () => {
    try {
      console.log(config)
      await SaveConfig(config)
      await StartDaemon(false)
      setError(undefined)
    } catch (e) {
      console.log(e)
      setError(e as string)
    }
  }, [config])

  const generateSeed = useCallback(async () => {
    try {
      const seed = await GenerateSeed()
      setConfig((config) => ({
        ...config,
        recoveryPhrase: seed,
      }))
    } catch (e) {
      setError(e as string)
    }
  }, [])

  return (
    <div className="bg-blue-500 flex flex-col gap-2">
      <div>is configured? {isConfigured ? 'yes' : 'no'}</div>
      {error && <div>Error: {error}</div>}
      <TextField placeholder="Data directory" />
      <input
        type="text"
        placeholder="Recovery phrase"
        value={config.recoveryPhrase}
        onChange={(e) => console.log(e)}
      />
      <button onClick={generateSeed}>Generate Seed</button>
      <input type="text" placeholder="HTTP address" />
      <input
        type="text"
        placeholder="HTTP password"
        onChange={(e) => {
          const password = e.currentTarget.value
          setConfig((config) => ({
            ...config,
            http: {
              ...config.http,
              password,
            },
          }))
        }}
      />
      <input type="text" placeholder="Gateway address" />
      <input type="text" placeholder="RHP2 address" />
      <input type="text" placeholder="RHP3 TCP address" />
      <input type="text" placeholder="RHP3 WebSocket address" />
      <label>Log Level</label>
      <select>
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
      </select>
      <button onClick={() => save()}>Save</button>
    </div>
  )
}
