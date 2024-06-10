const config = require('@dtdot/eslint-config');

module.exports = [
  ...config.eslint.configs.react,
  {
    ignores: ['build', 'eslint.config.*', 'prettier.config.*', 'src/generated/*'],
  },
];
