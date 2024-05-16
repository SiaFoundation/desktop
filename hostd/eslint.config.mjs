import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    languageOptions: { globals: globals.browser },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
]
