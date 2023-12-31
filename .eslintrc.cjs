'use strict';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:jquery/slim',
    'plugin:@typescript-eslint/strict-type-checked',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: ['jquery', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/triple-slash-reference': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },
};
