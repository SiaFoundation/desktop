import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: [
      'main/**/*.{ts,tsx}',
      'renderer/**/*.{ts,tsx}',
      'scripts/**/*.{ts,tsx}',
    ],
    ignores: ['renderer/.next/**/*', 'out'],
  })),
  {
    ...pluginReactConfig,
    files: ['renderer/**/*.{ts,tsx}'],
    ignores: ['renderer/.next/**/*', 'out'],
    rules: { 'react/no-string-refs': 'off' },
  },
]
