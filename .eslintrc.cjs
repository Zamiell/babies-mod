// This is the configuration file for ESLint, the TypeScript linter:
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  extends: [
    // The linter base is the shared IsaacScript config:
    // https://github.com/IsaacScript/eslint-config-isaacscript/blob/main/mod.js
    "eslint-config-isaacscript/mod",
  ],

  parserOptions: {
    // ESLint needs to know about the project's TypeScript settings in order for TypeScript-specific
    // things to lint correctly. We do not point this at "./tsconfig.json" because certain files
    // (such at this file) should be linted but not included in the actual project output.
    project: "./tsconfig.eslint.json",
  },

  rules: {
    "class-methods-use-this": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector: "MethodDefinition[accessibility='public']",
        message: 'Using "public" class method modifiers are not allowed.',
      },
      {
        selector: "MethodDefinition[accessibility='private']",
        message: 'Using "private" class method modifiers are not allowed.',
      },
      {
        selector: "MethodDefinition[accessibility='protected']",
        message: 'Using "protected" class method modifiers are not allowed.',
      },
    ],
  },
};
