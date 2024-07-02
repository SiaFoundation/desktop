'use client'

import { useCallback, useMemo } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { useForm as useHookForm } from 'react-hook-form'
import { defaultValues } from './types'
import { getFields } from './fields'
import { copyToClipboard } from '@siafoundation/design-system'
import { Resources } from './resources'
import * as bip39 from 'bip39'

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
    copyToClipboard(mnemonic, 'recovery phrase')
    form.setValue('hasCopied', true, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    form.clearErrors(['mnemonic'])
  }, [mnemonic, form])

  const regenerateMnemonic = useCallback(async () => {
    try {
      const mnemonic = bip39.generateMnemonic()
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

  const s3Enabled = form.watch('s3Enabled')

  const fields = useMemo(
    () =>
      getFields({
        s3Enabled,
        defaultDataPath: resources?.defaultDataPath.data,
        toggleShowMnemonic,
        showMnemonic,
        toggleShowHttpPassword,
        showHttpPassword,
      }),
    [
      s3Enabled,
      dataDir,
      resources,
      copySeed,
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
