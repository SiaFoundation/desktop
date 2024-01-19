'use client'

import { IsValidPhrase, OpenDataDirectory } from '../../wailsjs/go/main/App.js'
import { Button, ConfigFields } from '@siafoundation/design-system'
import { Launch16, View16, ViewOff16 } from '@siafoundation/react-icons'
import { ConfigValues } from './types.js'

export function getFields({
  defaultDataPath,
  showMnemonic,
  toggleShowMnemonic,
  showHttpPassword,
  toggleShowHttpPassword,
}: {
  s3Enabled: boolean
  defaultDataPath?: string
  showMnemonic: boolean
  toggleShowMnemonic: () => void
  showHttpPassword: boolean
  toggleShowHttpPassword: () => void
}): ConfigFields<ConfigValues, never> {
  return {
    dataDir: {
      type: 'text',
      title: 'Data directory',
      actions: (
        <Button
          onClick={() => OpenDataDirectory()}
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
        const event = e as any
        event.currentTarget.select()
      },
      placeholder:
        'tent small dress shop wealth fantasy wave mobile hint faith skirt derive',
      validation: {
        required: 'required',
        validate: {
          valid: async (value) => {
            const valid = await IsValidPhrase(value as string)
            return valid || 'should be 12 word BIP39 mnemonic'
          },
          copied: (_, values: ConfigValues) =>
            values.hasCopied || 'Copy recovery phrase to continue',
        },
      },
    },
    hasCopied: {
      type: 'boolean',
      title: '',
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
    s3Enabled: {
      type: 'boolean',
      title: 'S3 interface',
      validation: {},
    },
    s3Address: {
      type: 'text',
      title: 'S3 address',
      placeholder: 'localhost:9985',
      validation: {},
    },
    s3DisableAuth: {
      type: 'boolean',
      title: 'S3 disable auth',
      validation: {},
    },
    s3HostBucketEnabled: {
      type: 'boolean',
      title: 'S3 host bucket',
      validation: {},
    },
  }
}
