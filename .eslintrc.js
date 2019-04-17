module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['import'],
  env: {
    browser: true,
    'cypress/globals': true
  },
  parser: 'babel-eslint',
  rules: {
    code: 100,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-underscore-dangle': ['error', { allow: ['__Rewire__', '__get__'] }],
    'react/jsx-curly-spacing': [0],
    'max-len': [1],
    // 'arrow-parens': [ 0 ],
    'import/prefer-default-export': [0],
    quotes: [2, 'single', 'avoid-escape'],
    'flowtype/define-flow-type': 1,
    'react/destructuring-assignment': [0],
    'import/no-extraneous-dependencies': [0],
    'import/no-cycle': [0],
    'no-plusplus': [0]
    // 'object-curly-spacing': [ 'always' ],
    // 'array-bracket-spacing': [ 0 ],
  }
};
