import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'test-results/', 'playwright-report/', 'playwright/.cache/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
