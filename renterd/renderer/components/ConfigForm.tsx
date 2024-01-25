'use client'

import {
  Button,
  Panel,
  FieldText,
  Separator,
  FieldSwitch,
  FieldSelect,
  FieldError,
  Text,
  Code,
} from '@siafoundation/design-system'
import { useConfig } from '../contexts/config'
import { SeedField } from './SeedField'
import { ConfigValues } from '../contexts/config/types'

export function ConfigForm() {
  const { form, fields, showAdvanced, setShowAdvanced, notConfiguredYet } =
    useConfig()

  return (
    <Panel className="max-w-[400px] overflow-hidden">
      <div className="flex flex-col gap-2 w-full p-3">
        {notConfiguredYet && (
          <>
            <Text size="14">
              Welcome to <Code>renterd</Code>!
            </Text>
            <Text size="14" color="subtle">
              Get started by configuring a recovery phrase for your wallet and a
              password for unlocking the user interface.
            </Text>
            <Separator className="w-full" />
          </>
        )}
        <FieldError<ConfigValues> form={form} name="root" />
        <SeedField />
        <FieldText form={form} fields={fields} name="httpPassword" />
        <div className="flex items-center gap-3 pt-2">
          <Separator className="flex-1" />
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide advanced settings' : 'Show advanced settings'}
          </Button>
          <Separator className="flex-1" />
        </div>
        {showAdvanced && (
          <>
            <FieldText form={form} fields={fields} name="dataDir" />
            <FieldSelect form={form} fields={fields} name="logLevel" />
            <FieldText form={form} fields={fields} name="s3Address" />
            <div className="flex items-center gap-5">
              <FieldSwitch
                size="small"
                form={form}
                fields={fields}
                name="s3Enabled"
              />
              <FieldSwitch
                size="small"
                form={form}
                fields={fields}
                name="s3DisableAuth"
              />
              <FieldSwitch
                size="small"
                form={form}
                fields={fields}
                name="s3HostBucketEnabled"
              />
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}
