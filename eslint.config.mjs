import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  {
    files: ['**/*.ts'],
    rules: {
      'indent': ['warn', 4],
      'quotes': ['warn', 'single'],
      '@typescript-eslint/no-explicit-any': ['warn'],
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];