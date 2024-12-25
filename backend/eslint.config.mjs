import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Disables the "Unexpected any" rule
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }, // Ignore unused variables prefixed with '_'
      ],
    },
  },
  { plugins: { prettier } },
  { ignores: ['dist/**/*'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  prettierConfig,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
