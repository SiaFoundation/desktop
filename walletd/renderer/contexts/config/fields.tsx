'use client'

import { Button, ConfigFields } from '@siafoundation/design-system'
import { Launch16, View16, ViewOff16 } from '@siafoundation/react-icons'
import { ConfigValues } from './types.js'

export function getFields({
  defaultDataPath,
  showHttpPassword,
  toggleShowHttpPassword,
}: {
  defaultDataPath?: string
  showHttpPassword: boolean
  toggleShowHttpPassword: () => void
}): ConfigFields<ConfigValues, never> {
  return {
    dataDir: {
      type: 'text',
      title: 'Data directory',
      actions: (
        <Button
          onClick={() => window.electron.openDataDirectory()}
          tip="Open data directory"
          variant="ghost"
          icon="hover"
          size="none"
        >
          <Launch16 className="scale-75" />
        </Button>
      ),
      placeholder: defaultDataPath,
      validation: {
        required: 'required',
      },
    },
    httpAddress: {
      type: 'text',
      title: 'HTTP address',
      placeholder: 'localhost:9980',
      validation: {
        required: 'required',
      },
    },
    httpPassword: {
      type: showHttpPassword ? 'text' : 'password',
      actions: (
        <Button
          onClick={toggleShowHttpPassword}
          tip={showHttpPassword ? 'Hide password' : 'Show password'}
          variant="ghost"
          icon="hover"
          size="none"
          className="pl-0.5"
        >
          {showHttpPassword ? (
            <View16 className="scale-90" />
          ) : (
            <ViewOff16 className="scale-90" />
          )}
        </Button>
      ),
      title: 'Password',
      placeholder: 'secure password 123',
      validation: {
        required: 'required',
      },
    },
    autoOpenWebUI: {
      type: 'boolean',
      title: 'Automatically open the web UI on startup',
      validation: {},
    },
    logLevel: {
      type: 'text',
      title: 'Log level',
      placeholder: 'info',
      options: [
        {
          label: 'Debug',
          value: 'debug',
        },
        {
          label: 'Info',
          value: 'info',
        },
        {
          label: 'Warn',
          value: 'warn',
        },
        {
          label: 'Error',
          value: 'error',
        },
      ],
      validation: {},
    },
    indexMode: {
      type: 'select',
      title: 'Index mode',
      options: [
        {
          label: 'Personal',
          value: 'personal',
        },
        {
          label: 'Full',
          value: 'full',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      validation: {},
    },
    indexBatchSize: {
      type: 'number',
      title: 'Index batch size',
      placeholder: '64',
      validation: {
        required: 'required',
        validate: {
          min: (value: number) => value >= 1 || 'must be greater than 0',
          max: (value: number) => value <= 1024 || 'must be less than 1024',
        },
      },
    },
    consensusNetwork: {
      type: 'select',
      title: 'Consensus network',
      options: [
        {
          label: 'Mainnet',
          value: 'mainnet',
        },
        {
          label: 'Zen',
          value: 'zen',
        },
      ],
      validation: {},
    },
    syncerAddress: {
      type: 'text',
      title: 'Syncer gateway address',
      placeholder: ':9981',
      validation: {
        required: 'required',
      },
    },
    syncerBootstrap: {
      type: 'boolean',
      title: 'Syncer bootstrap',
      validation: {},
    },
    syncerEnableUPnP: {
      type: 'boolean',
      title: 'Syncer enable UPnP',
      validation: {},
    },
  }
}
