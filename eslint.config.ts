import { FlatCompat } from '@eslint/eslintrc'
import tsParser from '@typescript-eslint/parser'

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  // This is a basic recommended config
  recommendedConfig: {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn'
    }
  }
})

// Import Next.js config
const nextConfig = compat.extends('next/core-web-vitals')[0]

export default [
  // Configure TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  // Include Next.js config with updated languageOptions
  {
    ...nextConfig,
    languageOptions: {
      ...nextConfig.languageOptions,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module'
      }
    }
  },
  // Basic rules config
  {
    files: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      '**/*.mts',
      '**/*.cts'
    ],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn'
    }
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
      '*.tsbuildinfo',
      'next-env.d.ts',
      'eslint.config.js'
    ]
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
      parser: undefined,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {}
  },
  // Special configuration for type declaration files
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off'
    }
  }
]
