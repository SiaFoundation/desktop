'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import {
  triggerErrorToast,
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

  const {
    form,
    fields,
    showAdvanced,
    setShowAdvanced,
    regenerateMnemonic,
    copyMnemonic,
    hasCopiedMnemonic,
    savedMnemonic,
    mnemonicReadOnly,
    setMnemonicReadOnly,
  } = useForm({
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
      triggerErrorToast({ title: 'Error fetching settings' })
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
      if (savedMnemonic !== values.mnemonic && !hasCopiedMnemonic) {
        triggerErrorToast({
          title: 'Please copy and securely store the recovery phrase',
        })
        return
      }
      const firstTimeConfiguring = notConfiguredYet
      const saveConfig = await window.electron.saveConfig(transformUp(values))
      if (saveConfig.error) {
        console.error(saveConfig.error)
        triggerErrorToast({
          title: saveConfig.error.message,
        })
        return
      }
      setMnemonicReadOnly(true)
      await startDaemon()
      if (firstTimeConfiguring) {
        window.electron.closeWindow()
      }
      await revalidateAndResetForm()
    },
    [
      form,
      startDaemon,
      revalidateAndResetForm,
      notConfiguredYet,
      setMnemonicReadOnly,
      hasCopiedMnemonic,
    ]
  )

  // TODO: https://github.com/SiaFoundation/web/issues/629
  // const onInvalid = useOnInvalid(fields)

  const onSubmit = useMemo(() => form.handleSubmit(onValid), [form, onValid])

  return {
    notConfiguredYet,
    form,
    fields,
    isConfigured,
    changeCount,
    copyMnemonic,
    mnemonicReadOnly,
    setMnemonicReadOnly,
    regenerateMnemonic,
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
