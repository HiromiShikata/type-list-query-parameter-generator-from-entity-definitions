const fs = require('fs');
const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
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
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        requireConfigFile: true,
        sourceType: 'module',
      },
    },
    plugins: {
      'no-type-assertion': noTypeAssertion,
      'unused-imports': unusedImports,
      'import-x': importX,
    },
    settings: {
      'import-x/extensions': ['.ts', '.tsx', '.js', '.jsx'],
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-type-assertion/no-type-assertion': 'error',
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
