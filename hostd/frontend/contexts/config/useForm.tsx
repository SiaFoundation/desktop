'use client'

import { useCallback, useMemo } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { useForm as useHookForm } from 'react-hook-form'
import { defaultValues } from './types'
import { getFields } from './fields'
import { copyToClipboard } from '@siafoundation/design-system'
import { Resources } from './resources'
import { GenerateSeed } from '../../wailsjs/go/main/App'

export function useForm({ resources }: { resources?: Resources }) {
  const form = useHookForm({
    mode: 'all',
    defaultValues,
  })
  const dataDir = form.watch('dataDir')
  const mnemonic = form.watch('mnemonic')

  const [showAdvanced, setShowAdvanced] = useLocalStorageState<boolean>(
    'v0/config/showAdvanced',
    {
      defaultValue: false,
    }
  )
  const [showMnemonic, setShowMnemonic] = useLocalStorageState<boolean>(
    'v0/config/showMnemonic',
    {
      defaultValue: false,
    }
  )

  const toggleShowMnemonic = useCallback(() => {
    setShowMnemonic((showMnemonic) => !showMnemonic)
  }, [setShowMnemonic])

  const [showHttpPassword, setShowHttpPassword] = useLocalStorageState<boolean>(
    'v0/config/showHttpPassword',
    {
      defaultValue: false,
    }
  )

  const toggleShowHttpPassword = useCallback(() => {
    setShowHttpPassword((showHttpPassword) => !showHttpPassword)
  }, [setShowHttpPassword])

  const copySeed = useCallback(() => {
    copyToClipboard(mnemonic, 'seed')
    form.setValue('hasCopied', true, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    form.clearErrors(['mnemonic'])
  }, [mnemonic, form])

  const regenerateMnemonic = useCallback(async () => {
    try {
      const mnemonic = await GenerateSeed()
      form.setValue('hasCopied', false)
      form.setValue('mnemonic', mnemonic, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      form.clearErrors(['hasCopied', 'mnemonic'])
    } catch (e) {
      form.setError('mnemonic', {
        message: e as string,
      })
    }
  }, [form])

  const fields = useMemo(
    () =>
      getFields({
        defaultDataPath: resources?.defaultDataPath.data,
        toggleShowMnemonic,
        showMnemonic,
        toggleShowHttpPassword,
        showHttpPassword,
      }),
    [
      resources,
      toggleShowMnemonic,
      showMnemonic,
      toggleShowHttpPassword,
      showHttpPassword,
    ]
  )

  return {
    form,
    fields,
    showAdvanced,
    setShowAdvanced,
    dataDir,
    mnemonic,
    copySeed,
    regenerateMnemonic,
  }
}
