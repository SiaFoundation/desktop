'use client'

import {
  Button,
  ControlGroup,
  FieldLabelAndError,
  FieldText,
  FieldTextArea,
  Text,
} from '@siafoundation/design-system'
import {
  Copy16,
  Edit16,
  Locked16,
  Redo16,
  SeedIcon,
} from '@siafoundation/react-icons'
import { useConfig } from '../contexts/config'
import { SeedLayout } from './SeedLayout'

export function SeedField() {
  const {
    form,
    fields,
    regenerateMnemonic,
    mnemonicReadOnly,
    setMnemonicReadOnly,
    copyMnemonic,
  } = useConfig()
  const mnemonic = form.watch('mnemonic')
  const { error } = form.getFieldState('mnemonic')

  if (mnemonicReadOnly) {
    return (
      <div className="flex flex-col gap-1">
        <FieldLabelAndError
          title="Recovery phrase"
          form={form}
          name="mnemonic"
        />
        <ControlGroup>
          <Button className="flex-1" state="waiting">
            <Text color="subtle">Recovery phrase is configured</Text>
          </Button>
          <Button
            tip="Copy recovery phrase to clipboard"
            onClick={copyMnemonic}
          >
            <Copy16 />
          </Button>
          <Button
            tip="Change recovery phrase"
            onClick={() => setMnemonicReadOnly(false)}
          >
            <Edit16 />
          </Button>
        </ControlGroup>
        {/* field is not visible but registering the field is required for react-hook-form to validate */}
        <div className="hidden">
          <FieldText form={form} fields={fields} name="mnemonic" />
        </div>
      </div>
    )
  }

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
          <Button
            className="flex-1"
            onClick={regenerateMnemonic}
            tip="Generate new recovery phrase"
          >
            <Redo16 />
            {mnemonic ? 'Regenerate' : 'Generate'}
          </Button>
          <Button
            disabled={!mnemonic}
            className="flex-1"
            onClick={copyMnemonic}
            tip="Copy recovery phrase to clipboard"
          >
            <Copy16 />
            Copy
          </Button>
          <Button
            disabled={!mnemonic || !!error}
            className="flex-1"
            onClick={() => setMnemonicReadOnly(true)}
            tip="Lock the recovery phrase input field"
          >
            <Locked16 />
            Lock
          </Button>
        </div>
      </div>
    </SeedLayout>
  )
}
