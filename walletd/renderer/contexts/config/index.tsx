'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import {
  triggerErrorToast,
  useOnInvalid,
  useFormInit,
  useFormServerSynced,
  useFormChangeCount,
} from '@siafoundation/design-system'
import { useConfigData as useConfigData } from '../../components/useConfigData'
import { useIsConfigured } from '../../components/useIsConfigured'
import { useDefaultDataPath } from '../../components/useDefaultDataPath'
import { useDaemon } from '../../components/useDaemon'
import { ConfigValues } from './types'
import { transformDown, transformUp } from './transform'
import {
  checkIfAllResourcesLoaded,
  checkIfAnyResourcesErrored,
} from './resources'
import { useForm } from './useForm'

function useConfigMain() {
  const defaultDataPath = useDefaultDataPath()
  const config = useConfigData()

  // resources required to intialize form
  const resources = useMemo(
    () => ({
      config: {
        data: config.data,
        error: config.error,
      },
      defaultDataPath: {
        data: defaultDataPath.data,
        error: defaultDataPath.error,
      },
    }),
    [config.data, config.error, defaultDataPath.data, defaultDataPath.error]
  )

  const { form, fields, showAdvanced, setShowAdvanced } = useForm({
    resources,
  })

  const remoteValues = useMemo(() => {
    if (!checkIfAllResourcesLoaded(resources)) {
      return undefined
    }
    return transformDown({
      config: resources.config.data!,
      defaultDataPath: resources.defaultDataPath.data!,
    })
  }, [resources])

  const remoteError = useMemo(
    () => checkIfAnyResourcesErrored(resources),
    [resources]
  )

  const revalidateAndResetForm = useCallback(async () => {
    const _config = await config.mutate()
    if (!_config) {
      triggerErrorToast('Error fetching settings.')
    } else {
      return form.reset(
        transformDown({
          config: _config,
          defaultDataPath: defaultDataPath.data!,
        })
      )
    }
  }, [form, config])

  useFormInit({
    form,
    remoteValues,
  })
  useFormServerSynced({
    form,
    remoteValues,
  })
  const { changeCount } = useFormChangeCount({ form })

  const isConfigured = useIsConfigured()
  const notConfiguredYet = !isConfigured.isLoading && !isConfigured.data

  const { startDaemon } = useDaemon()
  const onValid = useCallback(
    async (values: ConfigValues) => {
      const firstTimeConfiguring = notConfiguredYet
      try {
        await window.electron.saveConfig(transformUp(values))
        await startDaemon()
        await revalidateAndResetForm()
        if (firstTimeConfiguring) {
          window.electron.closeWindow()
        }
      } catch (e) {
        console.log(e)
        form.setError('root', {
          message: e as string,
        })
      }
    },
    [form, startDaemon, revalidateAndResetForm, notConfiguredYet]
  )

  const onInvalid = useOnInvalid(fields)

  const onSubmit = useMemo(
    () => form.handleSubmit(onValid, onInvalid),
    [form, onInvalid, onValid]
  )

  return {
    notConfiguredYet,
    form,
    fields,
    isConfigured,
    changeCount,
    onSubmit,
    revalidateAndResetForm,
    showAdvanced,
    setShowAdvanced,
    remoteError,
  }
}

type State = ReturnType<typeof useConfigMain>

const ConfigContext = createContext({} as State)
export const useConfig = () => useContext(ConfigContext)

type Props = {
  children: React.ReactNode
}

export function ConfigProvider({ children }: Props) {
  const state = useConfigMain()
  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
  )
}