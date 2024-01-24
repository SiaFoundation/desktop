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
import { useIsConfigured } from './useIsConfigured'
import { ConfigValues } from '../contexts/config/types'

export function ConfigForm() {
  const { form, fields, showAdvanced, setShowAdvanced } = useConfig()
  const isConfigured = useIsConfigured()
  const notConfiguredYet = !isConfigured.isLoading && !isConfigured.data

  return (
    <Panel className="max-w-[400px] overflow-hidden">
      <div className="flex flex-col gap-2 w-full p-3">
        {notConfiguredYet && (
          <>
            <Text size="14">
              Welcome to <Code>hostd</Code>!
            </Text>
            <Text size="14" color="subtle">
              Get started by configuring a recovery phrase for your wallet and a
              password for unlocking the user interface.
            </Text>
            <Separator className="w-full" />
          </>
        )}
        <FieldError<ConfigValues> form={form} name="root" />
        <FieldText form={form} fields={fields} name="name" />
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
            <div className="flex gap-2">
              <div className="flex-1">
                <FieldText form={form} fields={fields} name="httpAddress" />
              </div>
              <div className="flex-1">
                <FieldText
                  form={form}
                  fields={fields}
                  name="consensusGatewayAddress"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <FieldText form={form} fields={fields} name="rhp2Address" />
              </div>
              <div className="flex-1">
                <FieldText form={form} fields={fields} name="rhp3AddressTcp" />
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}
