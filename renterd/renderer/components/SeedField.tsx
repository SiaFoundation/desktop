'use client'

import { Button, FieldText, FieldTextArea } from '@siafoundation/design-system'
import { Copy16, Redo16, SeedIcon } from '@siafoundation/react-icons'
import { useConfig } from '../contexts/config'
import { SeedLayout } from './SeedLayout'

export function SeedField() {
  const { form, fields, regenerateMnemonic, copySeed } = useConfig()
  const mnemonic = form.watch('mnemonic')
  return (
    <SeedLayout
      icon={<SeedIcon />}
      description={
        <>
          This is the wallet's recovery phrase. Make sure to save it somewhere
          secure.
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {fields.mnemonic.type === 'password' ? (
          <FieldText form={form} fields={fields} name="mnemonic" />
        ) : (
          <FieldTextArea form={form} fields={fields} name="mnemonic" />
        )}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={regenerateMnemonic}>
            <Redo16 />
            {mnemonic ? 'Regenerate' : 'Generate'}
          </Button>
          <Button disabled={!mnemonic} className="flex-1" onClick={copySeed}>
            <Copy16 />
            Copy to clipboard
          </Button>
        </div>
      </div>
    </SeedLayout>
  )
}
