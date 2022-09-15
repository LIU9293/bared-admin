import { Box } from '@strapi/design-system/Box'
import { TextInput } from '@strapi/design-system/TextInput'
import { Textarea } from '@strapi/design-system/Textarea'
import { NumberInput } from '@strapi/design-system/NumberInput'

export default function DynamicInput ({
  type,
  name,
  value,
  onValueChange
}) {
  return (
    <Box>
      {type === 'string' &&
        <TextInput
          aria-label={name}
          name={name}
          value={value || ''}
          onChange={e => onValueChange(e.target.value, name)}
        />}
      {(type === 'integer' || type === 'number' || type === 'float' || type === 'bigint') &&
        <NumberInput
          aria-label={name}
          name={name}
          value={value || 0}
          onValueChange={e => onValueChange(e, name)}
        />}
      {(type === 'json' || type === 'text') &&
        <Textarea
          name={name}
          onChange={e => {
            onValueChange(e.target.value, name)
          }}
          value={value}
        />}
    </Box>
  )
}
