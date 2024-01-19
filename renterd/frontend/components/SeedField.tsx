export function SeedField() {
  const { form, fields, regenerateMnemonic, copySeed } = useConfig()
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
            Regenerate
          </Button>
          <Button className="flex-1" onClick={copySeed}>
            <Copy16 />
            Copy to clipboard
          </Button>
        </div>
      </div>
    </SeedLayout>
  )
}

import {
  Button,
  FieldText,
  FieldTextArea,
  Panel,
  Paragraph,
} from '@siafoundation/design-system'
import { Copy16, Redo16, SeedIcon } from '@siafoundation/react-icons'
import { useConfig } from '../contexts/config'

type Props = {
  children?: React.ReactNode
  icon: React.ReactNode
  description: React.ReactNode
  copySeed?: () => void
}

function SeedLayout({ copySeed, children, icon, description }: Props) {
  return (
    <div className="">
      {children}
      <Panel className="mt-2">
        <div className="flex gap-6 items-center py-4 px-4">
          <div className="flex">{icon}</div>
          <div className="flex flex-col gap-2">
            <Paragraph size="14">{description}</Paragraph>
            {copySeed && (
              <Button onClick={copySeed}>Copy Seed to Clipboard</Button>
            )}
          </div>
        </div>
      </Panel>
    </div>
  )
}
