/* eslint-disable import/no-commonjs */
/**
 * ESLint + FSD boundaries.
 * Архитектура: docs/FSD_ARCHITECTURE.md, .cursorrules
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y', 'prettier', 'boundaries'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  settings: {
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'pages', pattern: 'src/pages/*' },
      { type: 'widgets', pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared', pattern: 'src/shared/*' },
    ],
  },
  rules: {
    'prettier/prettier': 'error',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          { from: 'shared', allow: ['shared'] },
          { from: 'entities', allow: ['shared'] },
          { from: 'features', allow: ['entities', 'shared'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared'] },
          { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
          { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
        ],
      },
    ],
    'boundaries/entry-point': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            target: ['app', 'pages', 'widgets', 'features', 'entities'],
            allow: ['index.{ts,tsx}', 'index.{js,jsx}'],
            message:
              'Импортируйте слайс только из barrel (index). Например: @/features/access, @/entities/user.',
          },
          {
            target: ['shared'],
            allow: '*',
            message: 'Импорт из shared — по публичному API модуля.',
          },
        ],
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.config.js', '**/*.config.cjs', '**/*.config.ts', '**/vite.config.ts'] },
    ],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '**/features/*/*',
              '**/entities/*/*',
              '**/widgets/*/*',
              '**/pages/*/*',
              '@/features/*/*',
              '@/entities/*/*',
              '@/widgets/*/*',
              '@/pages/*/*',
            ],
            message:
              'Импортируйте только из barrel слайса (index). Например: @/entities/user, @/features/access — не внутренние пути .../model или .../ui.',
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration:not([const=true])',
        message:
          'Используйте объект с "as const" вместо enum. Обычный enum порождает runtime-код и мешает tree-shaking.',
      },
    ],
  },
  overrides: [],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '*.min.js',
    'coverage',
    '*.config.js',
    '*.config.cjs',
    '*.config.mjs',
    'vite.config.ts',
    'examples',
    'server-mock',
  ],
};
