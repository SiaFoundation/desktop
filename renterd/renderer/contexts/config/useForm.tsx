'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [showMnemonic, setShowMnemonic] = useState(false)

  const savedMnemonic = useMemo(
    () => resources?.config?.data?.seed,
    [resources]
  )

  const [mnemonicReadOnly, setMnemonicReadOnly] = useState(false)

  const toggleShowMnemonic = useCallback(() => {
    setShowMnemonic((showMnemonic) => !showMnemonic)
  }, [setShowMnemonic])

  const [showHttpPassword, setShowHttpPassword] = useState(false)

  const toggleShowHttpPassword = useCallback(() => {
    setShowHttpPassword((showHttpPassword) => !showHttpPassword)
  }, [setShowHttpPassword])

  const [hasCopiedMnemonic, setHasCopiedMnemonic] = useState(false)
  const copyMnemonic = useCallback(() => {
    copyToClipboard(mnemonic, 'recovery phrase')
    setHasCopiedMnemonic(true)
  }, [mnemonic, form])

  // Reset the mnemonicReadOnly state whenever the saved mnemonic changes.
  useEffect(() => {
    if (savedMnemonic) {
      setMnemonicReadOnly(true)
    }
  }, [savedMnemonic])

  // Reset the copied check whenever the mnemonic changes.
  useEffect(() => {
    setHasCopiedMnemonic(false)
  }, [mnemonic])

  const regenerateMnemonic = useCallback(async () => {
    try {
      if (savedMnemonic) {
        const yes = confirm(
          'Are you sure you want to regenerate the recovery phrase? The current recovery phrase will be replaced with a new one.'
        )
        if (!yes) {
          return
        }
      }
      const mnemonic = bip39.generateMnemonic()
      form.setValue('mnemonic', mnemonic, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      form.clearErrors(['mnemonic'])
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
      copyMnemonic,
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
    copyMnemonic,
    hasCopiedMnemonic,
    regenerateMnemonic,
    mnemonicReadOnly,
    savedMnemonic,
    setMnemonicReadOnly,
  }
}
