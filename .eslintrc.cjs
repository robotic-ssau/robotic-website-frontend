/* eslint-disable import/no-commonjs */
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
      { type: 'app', pattern: 'src/app/*' },
      { type: 'ui', pattern: 'src/ui/*' },
      { type: 'pages', pattern: 'src/pages/*' },
      { type: 'widgets', pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared', pattern: 'src/shared/*' },
      { type: 'lib', pattern: 'src/lib/*' },
    ],
  },
  rules: {
    'prettier/prettier': 'error',
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          { from: 'lib', disallow: ['*'] },
          { from: 'shared', allow: ['lib'] },
          { from: 'entities', allow: ['shared', 'lib'] },
          { from: 'features', allow: ['entities', 'shared', 'lib'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared', 'lib'] },
          { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared', 'lib'] },
          { from: 'ui', allow: ['pages', 'widgets', 'features', 'entities', 'shared', 'lib'] },
          { from: 'app', allow: ['ui', 'pages', 'widgets', 'features', 'entities', 'shared', 'lib'] },
        ],
      },
    ],
    'boundaries/entry-point': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            target: ['app', 'pages', 'widgets', 'features', 'entities', 'ui'],
            allow: ['index.{ts,tsx}', 'index.{js,jsx}'],
            message:
              'Import only from barrel (index) of the slice. Use e.g. @/features/access or @/entities/user.',
          },
          {
            target: ['shared', 'lib'],
            allow: '*',
            message: 'Import from shared/lib public API.',
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
              '@/features/*/*',
              '@/entities/*/*',
            ],
            message:
              'Import only from barrel (index) of features and entities. Use e.g. @/features/access or @/entities/user, not internal paths like .../model or .../ui.',
          },
        ],
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
  ],
};
