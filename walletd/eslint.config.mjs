import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  {
    ignores: ['dist', 'renderer/.next', 'renderer/out'],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  ...compat.config({
    extends: ['next', 'next/typescript'],
    settings: {
      next: {
        rootDir: 'renderer/',
      },
    },
  }),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      'forge.config.js',
      'renderer/tailwind.config.js',
      'renderer/postcss.config.js',
      'renderer/next.config.js',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]

export default eslintConfig
