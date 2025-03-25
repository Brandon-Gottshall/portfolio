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
      // Dependencies
      '**/node_modules/**',
      '.pnp',
      '.pnp.js',
      
      // Build outputs
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      
      // Temporary directories
      'tmp_repos/**',
      'tmp/**',
      'temp/**',
      '.tmp/**',
      'Component Archive/**',
      
      // Generated files
      '.coverage',
      '.nyc_output',
      '*.tsbuildinfo',
      'next-env.d.ts',
      '*.d.ts',
      
      // Specific files to exclude
      'eslint.config.js',
      
      // Exclude sanity config files from being ignored
      '!sanity.cli.ts',
      '!sanity.config.ts'
    ]
  },
  ...compat.config({
    extends: ['next/core-web-vitals'],
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
      sourceType: 'module'
    }
  }),
  // Special configuration for tmp_repos directory
  {
    files: ['tmp_repos/**/*.js', 'tmp_repos/**/*.jsx', 'tmp_repos/**/*.ts', 'tmp_repos/**/*.tsx'],
    languageOptions: {
      parser: undefined, // Disable typescript-eslint parser
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  }
]

export default config 