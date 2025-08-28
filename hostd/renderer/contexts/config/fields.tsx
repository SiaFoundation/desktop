'use client'

import { Button, ConfigFields } from '@siafoundation/design-system'
import { Launch16, View16, ViewOff16 } from '@siafoundation/react-icons'
import { ConfigValues } from './types'
import * as bip39 from 'bip39'

export function getFields({
  defaultDataPath,
  showMnemonic,
  toggleShowMnemonic,
  showHttpPassword,
  toggleShowHttpPassword,
}: {
  defaultDataPath?: string
  showMnemonic: boolean
  toggleShowMnemonic: () => void
  showHttpPassword: boolean
  toggleShowHttpPassword: () => void
}): ConfigFields<ConfigValues, never> {
  return {
    name: {
      type: 'text',
      title: 'Name',
      placeholder: 'A friendly name for your host, eg: my-host',
      validation: {
        required: 'required',
      },
    },
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
    mnemonic: {
      type: showMnemonic ? 'text' : 'password',
      title: 'Recovery phrase',
      actions: (
        <Button
          onClick={toggleShowMnemonic}
          tip={showMnemonic ? 'Hide recovery phrase' : 'Show recovery phrase'}
          variant="ghost"
          icon="hover"
          size="none"
          className="pl-0.5"
        >
          {showMnemonic ? (
            <View16 className="scale-90" />
          ) : (
            <ViewOff16 className="scale-90" />
          )}
        </Button>
      ),
      onClick: async (e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event = e as any
        event.currentTarget.select()
      },
      placeholder:
        'Example: tent small dress shop wealth fantasy wave mobile hint faith skirt derive',
      validation: {
        required: 'required',
        validate: {
          valid: (value) => {
            const valid = bip39.validateMnemonic(value as string)
            return valid || 'should be 12 word BIP39 mnemonic'
          },
        },
      },
    },
    autoOpenWebUI: {
      type: 'boolean',
      title: 'Automatically open the web UI on startup',
      validation: {},
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
    syncerAddress: {
      type: 'text',
      title: 'Syncer address',
      placeholder: ':9981',
      validation: {},
    },
    rhp4Port: {
      type: 'text',
      title: 'RHP4 port',
      placeholder: '9984',
      validation: {
        required: 'required',
        validate: {
          valid: (value) => {
            const valid =
              /^\d+$/.test(value as string) &&
              Number(value) >= 1 &&
              Number(value) <= 65535
            return valid || 'should be a number between 1 and 65535'
          },
        },
      },
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
  }
}
