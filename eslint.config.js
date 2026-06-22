const fs = require('fs');
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importX = require('eslint-plugin-import-x');
const noTypeAssertion = require('eslint-plugin-no-type-assertion');
const unusedImports = require('eslint-plugin-unused-imports');

const gitignorePatterns = fs
  .readFileSync('.gitignore', 'utf8')
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'));

module.exports = [
  { ignores: gitignorePatterns },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...tsPlugin.configs['flat/recommended-type-checked'],
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        project: ['tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      'no-type-assertion': noTypeAssertion,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-type-assertion/no-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/domain',
              from: './src/adapter',
            },
            {
              target: './src/domain/entities',
              from: './src/domain/usecases',
            },
            {
              target: './src/adapter/repositories',
              from: './src/adapter/entry-points',
            },
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
