const prettier = require('./.prettierrc.js');

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'no-autofix'],
  rules: {
    'arrow-body-style': 'off',
    'no-autofix/arrow-body-style': 'error',
    'react/self-closing-comp': 'off',
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
    'react/no-unused-state': 'warn',
    'react/prefer-stateless-function': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.json', '.native.js'],
      },
    ],
    'prettier/prettier': ['error', prettier],
  },
};
