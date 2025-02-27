'use client'

import { AppBackdrop, ScrollArea } from '@siafoundation/design-system'
import { ConfigForm } from './ConfigForm'
import { useConfig } from '../contexts/config'
import { Header } from './Header'
import { LogViewer } from './LogViewer'

export function App() {
  const { onSubmit } = useConfig()
  return (
    <form onSubmit={onSubmit}>
      <AppBackdrop />
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <ScrollArea className="flex-1 [&>div>div]:!block">
          <div className="flex flex-col gap-3 w-full justify-center items-center pb-14">
            <Header />
            <ConfigForm />
          </div>
        </ScrollArea>
      </div>
      <LogViewer />
    </form>
  )
}
