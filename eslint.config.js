// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    rules: {
      // typescript-eslint turns this off, expecting tsc to catch it, but tsc doesn't by default
      'no-unreachable': 'error',
    },
  },
  eslintConfigPrettier,
]);
