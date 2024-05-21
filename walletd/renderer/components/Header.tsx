'use client'

import {
  Text,
  Button,
  Panel,
  FormSubmitButton,
  Tooltip,
  LoadingDots,
} from '@siafoundation/design-system'
import { Launch16, Reset16 } from '@siafoundation/react-icons'
import { useDaemon } from './useDaemon'
import { useConfig } from '../contexts/config'
import { useConfigData } from './useConfigData'

export function Header() {
  const { isRunning, isLoading, startDaemon, stopDaemon } = useDaemon()
  const { form, isConfigured, changeCount, revalidateAndResetForm } =
    useConfig()
  const config = useConfigData()

  const changeCountEl = (
    <Tooltip
      content={`${changeCount} unsaved ${
        changeCount === 1 ? 'change' : 'changes'
      }`}
    >
      <Text size="12" color="subtle" ellipsis>
        {changeCount} {changeCount === 1 ? 'change' : 'changes'}
      </Text>
    </Tooltip>
  )

  const resetButtonEl = (
    <Button onClick={revalidateAndResetForm} tip="Reset changes" icon="hover">
      <Reset16 />
    </Button>
  )

  return (
    <Panel className="sticky z-10 top-0 w-full h-10 flex gap-2 justify-center items-center px-3 max-w-[500px] rounded-t-none">
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
      <div className="flex-1" />
      <div className="flex gap-1 items-center">
        {isRunning.data ? (
          changeCount > 0 ? (
            <div className="flex gap-2 items-center">
              {changeCountEl}
              {resetButtonEl}
              <FormSubmitButton variant="amber" size="small" form={form}>
                save and restart daemon
              </FormSubmitButton>
            </div>
          ) : (
            <Button
              variant="red"
              state={isLoading ? 'waiting' : undefined}
              className="min-w-[100px]"
              onClick={async () => {
                await stopDaemon()
              }}
            >
              {isLoading ? <LoadingDots /> : 'stop daemon'}
            </Button>
          )
        ) : !isConfigured.data ? (
          <div className="flex gap-2 items-center">
            {changeCount > 0 && changeCountEl}
            <FormSubmitButton variant="accent" size="small" form={form}>
              save and start daemon
            </FormSubmitButton>
          </div>
        ) : changeCount > 0 ? (
          <div className="flex gap-2 items-center">
            {changeCountEl}
            {resetButtonEl}
            <FormSubmitButton variant="amber" size="small" form={form}>
              save and start daemon
            </FormSubmitButton>
          </div>
        ) : (
          <Button
            variant="accent"
            state={isLoading ? 'waiting' : undefined}
            className="min-w-[100px]"
            onClick={async () => {
              await startDaemon()
            }}
          >
            {isLoading ? <LoadingDots /> : 'start daemon'}
          </Button>
        )}
        <Button
          disabled={!isRunning.data}
          onClick={() => {
            if (config.data) {
              window.electron.openBrowser('http://' + config.data.http.address)
            }
          }}
        >
          <Launch16 />
          open
        </Button>
      </div>
    </Panel>
  )
}
