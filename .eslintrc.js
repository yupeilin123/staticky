module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    quotes: ["error", "single"],
    semi: ["error", "always"],
    'arrow-parens': ["error", "as-needed"],
    'no-console': 0,
    'comma-dangle': ['error', 'never']
  },
  parserOptions: {
    ecmaVersion: 9
  }
}