// functions/eslint.config.cjs
const js = require('@eslint/js');
const google = require('eslint-config-google');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
    },
    plugins: {
      '@eslint/js': js,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...google.rules,
      'no-restricted-globals': ['error', 'name', 'length'],
      'prefer-arrow-callback': 'error',
      quotes: ['error', 'double', { allowTemplateLiterals: true }],
      'require-jsdoc': 'off', // Ensure this rule is off
    },
    settings: {},
  },
  {
    files: ['**/*.spec.js'],
    env: {
      mocha: true,
    },
  },
];




