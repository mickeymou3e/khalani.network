module.exports = {
  parser: '@typescript-eslint/parser',
  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020,
    // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
    // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },

  env: {
    jest: true,
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },

  plugins: ['import-order'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
      },
    },
  ],
}
