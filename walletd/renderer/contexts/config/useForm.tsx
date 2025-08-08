'use client'

import { useCallback, useMemo } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { useForm as useHookForm } from 'react-hook-form'
import { defaultValues } from './types'
import { getFields } from './fields'
import { Resources } from './resources'

export function useForm({ resources }: { resources?: Resources }) {
  const form = useHookForm({
    mode: 'all',
    defaultValues,
  })
  const dataDir = form.watch('dataDir')

  const [showAdvanced, setShowAdvanced] = useLocalStorageState<boolean>(
    'v0/config/showAdvanced',
    {
      defaultValue: false,
    }
  )

  const [showHttpPassword, setShowHttpPassword] = useLocalStorageState<boolean>(
    'v0/config/showHttpPassword',
    {
      defaultValue: false,
    }
  )

  const toggleShowHttpPassword = useCallback(() => {
    setShowHttpPassword((showHttpPassword) => !showHttpPassword)
  }, [setShowHttpPassword])

  const fields = useMemo(
    () =>
      getFields({
        defaultDataPath: resources?.defaultDataPath.data,
        toggleShowHttpPassword,
        showHttpPassword,
      }),
    [resources, toggleShowHttpPassword, showHttpPassword]
  )

  return {
    form,
    fields,
    showAdvanced,
    setShowAdvanced,
    dataDir,
  }
}
