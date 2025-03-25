const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.eslint.json']
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // Your rules here
    }
  }
] 