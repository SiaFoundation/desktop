'use client'

import {
  AppBackdrop,
  ScrollArea,
  ThemeRadio,
} from '@siafoundation/design-system'
import { ConfigForm } from './ConfigForm'
import { useConfig } from '../contexts/config'
import { Header } from './Header'

export function App() {
  const { onSubmit } = useConfig()
  return (
    <form onSubmit={onSubmit}>
      <div className="h-screen w-full flex justify-center items-center">
        <AppBackdrop />
        <ScrollArea>
          <div className="flex flex-col gap-3 w-full justify-center items-center pb-4">
            <Header />
            <ConfigForm />
            <ThemeRadio className="pt-1" />
          </div>
        </ScrollArea>
      </div>
    </form>
  )
}
