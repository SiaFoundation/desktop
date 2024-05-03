'use client'

import {
  Text,
  Button,
  Panel,
  FormSubmitButton,
  Tooltip,
} from '@siafoundation/design-system'
import { Launch16, Reset16 } from '@siafoundation/react-icons'
import { useDaemon } from './useDaemon'
import { useConfig } from '../contexts/config'
import { useConfigData } from './useConfigData'
import { useInstalledVersion } from './useInstalledVersion'

export function Header() {
  const { isRunning, startDaemon, stopDaemon } = useDaemon()
  const { form, isConfigured, changeCount, revalidateAndResetForm } =
    useConfig()
  const config = useConfigData()
  const installedVersion = useInstalledVersion()
  return (
    <Panel
      className="sticky z-10 top-0 w-full h-10 flex gap-2 justify-center items-center px-3 max-w-[500px] rounded-t-none"
      style={
        {
          '--wails-draggable': 'drag',
        } as any
      }
    >
      {isConfigured.data ? (
        isRunning.data ? (
          <div className="flex gap-1 items-center">
            <div className="flex relative w-2 h-2">
              <div className="absolute w-2 h-2 bg-green-500 rounded-full" />
              <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-pingslow" />
            </div>
            <Text font="mono" size="12" weight="bold">
              running
            </Text>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <div className="flex relative w-2 h-2">
              <div className="absolute w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <Text font="mono" size="12" weight="bold">
              stopped
            </Text>
          </div>
        )
      ) : (
        <div className="flex gap-1 items-center">
          <div className="flex relative w-2 h-2">
            <div className="absolute w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <Text font="mono" size="12" weight="bold">
            Configure
          </Text>
        </div>
      )}
      <div className="flex gap-2">
        <Text font="mono" size="12" weight="bold" color="verySubtle" ellipsis>
          {installedVersion.data}
        </Text>
      </div>
      <div className="flex-1" />
      <div className="flex gap-1 items-center">
        {isRunning.data ? (
          changeCount > 0 ? (
            <div className="flex gap-2 items-center">
              <Tooltip content={`${changeCount} changes`}>
                <Text size="12" color="subtle" ellipsis>
                  {changeCount} changes
                </Text>
              </Tooltip>
              <Button
                onClick={revalidateAndResetForm}
                tip="Reset changes"
                icon="hover"
              >
                <Reset16 />
              </Button>
              <FormSubmitButton variant="amber" size="small" form={form as any}>
                save and restart daemon
              </FormSubmitButton>
            </div>
          ) : (
            <Button
              variant="red"
              onClick={async () => {
                await stopDaemon()
              }}
            >
              stop daemon
            </Button>
          )
        ) : !isConfigured.data ? (
          <div className="flex gap-2 items-center">
            {changeCount > 0 && (
              <Text size="12" color="subtle">
                {changeCount} changes
              </Text>
            )}
            <FormSubmitButton variant="accent" size="small" form={form as any}>
              save and start daemon
            </FormSubmitButton>
          </div>
        ) : changeCount > 0 ? (
          <div className="flex gap-2 items-center">
            <Text size="12" color="subtle">
              {changeCount} changes
            </Text>
            <Button
              onClick={revalidateAndResetForm}
              tip="Reset changes"
              icon="hover"
            >
              <Reset16 />
            </Button>
            <FormSubmitButton variant="amber" size="small" form={form as any}>
              save and start daemon
            </FormSubmitButton>
          </div>
        ) : (
          <Button
            variant="accent"
            onClick={async () => {
              await startDaemon()
            }}
          >
            start daemon
          </Button>
        )}
        {isRunning.data && (
          <Button
            onClick={() => {
              if (config.data) {
                window.electron.openBrowser(
                  'http://' + config.data.http.address
                )
              }
            }}
          >
            <Launch16 />
            open
          </Button>
        )}
      </div>
    </Panel>
  )
}
