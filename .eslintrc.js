module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'import/prefer-default-export': 0,
    'no-multi-assign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-restricted-syntax': 0,
    'object-shorthand': 0,
    'prefer-const': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'no-plusplus': 0,
    'no-unused-vars': 0,
    'no-unused-expressions': 0,
    'spaced-comment': 0,
    'no-underscore-dangle': 0,
  }
}
