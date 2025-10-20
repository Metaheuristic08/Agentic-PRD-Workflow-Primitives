module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
        'no-console': ['warn', {allow: ['warn', 'error']}],
        'react-hooks/exhaustive-deps': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
      },
    },
  ],
};
