import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import type { Linter } from 'eslint'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
})

const config: Linter.FlatConfig[] = [
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '*.d.ts',
      'tmp_repos/**',
      'Component Archive/**',
      '!sanity.cli.ts',
      '!sanity.config.ts'
    ]
  },
  ...compat.config({
    extends: ['next/core-web-vitals']
  })
]

export default config 