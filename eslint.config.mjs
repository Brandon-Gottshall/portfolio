import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  {
    // Global ignores - these files won't be linted at all
    ignores: [
      '**/tmp_repos/**/*', // Catch tmp_repos anywhere in the path
      '**/tmp_repos/**/.obsidian/**/*', // Specifically catch .obsidian folders
      '**/node_modules/**/*',
      '**/.next/**/*',
      '**/build/**/*',
      '**/dist/**/*',
      '**/Component Archive/**/*',
      '**/next.config.ts',
      '**/tailwind.config.ts',
      '**/postcss.config.ts',
      '**/postcss.config.mjs',
      '**/components.json',
      '**/sanity.config.ts',
      '**/sanity.cli.ts',
      '**/sanity.schema.ts',
      '**/sanity.studio.tsx',
      '**/sanity.types.ts'
    ]
  },
  // Base configurations from Next.js
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript'
  ),
  // General TypeScript/JavaScript rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['**/tmp_repos/**/*', '**/node_modules/**/*', '**/.next/**/*', '**/build/**/*', '**/dist/**/*', '**/Component Archive/**/*', '**/next.config.ts', '**/tailwind.config.ts', '**/postcss.config.ts', '**/postcss.config.mjs', '**/components.json', '**/sanity.config.ts', '**/sanity.cli.ts', '**/sanity.schema.ts', '**/sanity.studio.tsx', '**/sanity.types.ts'],
    rules: {
      // Error handling patterns
      'no-else-return': 'error',

      // React/Next.js preferences
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Code complexity guidelines
      complexity: ['warn', 5],
      'max-depth': ['warn', 3],

      // Export preferences
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error'
    }
  },
  // Special config for Next.js pages and app directory
  {
    files: ['**/pages/**/*.{ts,tsx}', '**/app/**/*.{ts,tsx}', '**/next.config.ts', '**/tailwind.config.ts', '**/postcss.config.ts', '**/postcss.config.mjs', '**/components.json', '**/sanity.config.ts', '**/sanity.cli.ts', '**/sanity.schema.ts', '**/sanity.studio.tsx', '**/sanity.types.ts'],
    rules: {
      'import/no-default-export': 'off'
    }
  }
]

export default eslintConfig
