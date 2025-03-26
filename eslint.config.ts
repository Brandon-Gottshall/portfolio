import { FlatCompat } from '@eslint/eslintrc'
import * as path from 'node:path'
// Using require to avoid TypeScript module resolution issues
const parser = require('@typescript-eslint/parser')
const tseslint = require('@typescript-eslint/eslint-plugin')

const compat = new FlatCompat({
  baseDirectory: process.cwd()
})

// Import Next.js config
const nextConfig = compat.extends('next/core-web-vitals')[0] || {}

export default [
  // Global configuration
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },

  // Configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: path.resolve('./tsconfig.json'),
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // Next.js configuration
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ...(nextConfig || {}),
    languageOptions: {
      parserOptions: {
        project: path.resolve('./tsconfig.json'),
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },

  // Configuration for type declaration files
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: parser
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },

  // Special configuration for tmp_repos directory
  {
    files: [
      'tmp_repos/**/*.js',
      'tmp_repos/**/*.jsx',
      'tmp_repos/**/*.ts',
      'tmp_repos/**/*.tsx'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  },

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'tmp_repos/**',
      'tmp/**',
      'temp/**',
      '.tmp/**',
      'Component Archive/**',
      'node_modules/.cache/**',
      'next-env.d.ts',
      'eslint.config.js',
      '!sanity.cli.ts',
      '!sanity.config.ts'
    ]
  }
]
