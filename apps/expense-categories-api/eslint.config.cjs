const config = require('@dtdot/eslint-config');

module.exports = [
  ...config.eslint.configs.recommended,
  {
    ignores: ['build', 'eslint.config.*', 'prettier.config.*', 'src/generated/*'],
  },
];
