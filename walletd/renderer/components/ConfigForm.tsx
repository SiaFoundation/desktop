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
  FieldNumber,
} from '@siafoundation/design-system'
import { useConfig } from '../contexts/config'
import { ConfigValues } from '../contexts/config/types'
import { Footer } from './Footer'

export function ConfigForm() {
  const { form, fields, showAdvanced, setShowAdvanced, notConfiguredYet } =
    useConfig()

  return (
    <Panel className="w-[400px] overflow-hidden">
      <div className="flex flex-col gap-2 w-full p-3">
        {notConfiguredYet && (
          <>
            <Text size="14">
              Welcome to <Code>walletd</Code>!
            </Text>
            <Text size="14" color="subtle">
              This launcher window is used to configure and run walletd. The
              full walletd user interface opens in your web browser.
            </Text>
            <Text size="14" color="subtle">
              Get started by configuring a password for unlocking the user
              interface.
            </Text>
            <Separator className="w-full" />
          </>
        )}
        <FieldError<ConfigValues> form={form} name="root" />
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
            <FieldSelect form={form} fields={fields} name="indexMode" />
            <FieldNumber form={form} fields={fields} name="indexBatchSize" />
            <FieldSelect form={form} fields={fields} name="consensusNetwork" />
            <FieldText
              form={form}
              fields={fields}
              name="consensusGatewayAddress"
            />
            <FieldSwitch
              size="small"
              form={form}
              fields={fields}
              name="consensusBootstrap"
            />
            <FieldSwitch
              size="small"
              form={form}
              fields={fields}
              name="consensusEnableUPnP"
            />
            <div className="pt-2 pb-1">
              <Separator className="w-full" />
            </div>
          </>
        )}
        <Footer />
      </div>
    </Panel>
  )
}
