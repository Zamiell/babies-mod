// This is the configuration file for ESLint, the TypeScript linter:
// https://eslint.org/docs/latest/use/configure/

// @ts-check

import { completeConfigBase } from "eslint-config-complete";
import { isaacScriptModConfigBase } from "eslint-config-isaacscript";
import { defineConfig } from "eslint/config";

export default defineConfig(
  // https://github.com/complete-ts/complete/blob/main/packages/eslint-config-complete/src/base.js
  ...completeConfigBase,

  // https://github.com/IsaacScript/isaacscript/blob/main/packages/eslint-config-isaacscript/src/base.js
  ...isaacScriptModConfigBase,

  {
    rules: {
      // Insert changed or disabled rules here, if necessary.

      // @template-customization-start

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

      // TODO
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "complete/consistent-object-braces": "off",
      "complete/require-ascii": "off",
      "complete/type-declaration-immutability": "off",
      "complete/prefer-path-resolve": "off",
      "regexp/prefer-named-capture-group": "off",
      "regexp/prefer-regexp-exec": "off",
      "regexp/require-unicode-regexp": "off",
      "regexp/require-unicode-sets-regexp": "off",
      "unicorn/consistent-destructuring": "off",
      "unicorn/no-declarations-before-early-exit": "off",
      "unicorn/no-top-level-assignment-in-function": "off",
      "unicorn/no-top-level-side-effects": "off",
      "unicorn/no-useless-else": "off",
      "unicorn/prefer-boolean-return": "off",
      "unicorn/prefer-continue": "off",
      "unicorn/prefer-direct-iteration": "off",
      "unicorn/prefer-early-return": "off",
      "unicorn/prefer-math-abs": "off",
      "unicorn/prefer-minimal-ternary": "off",
      "unicorn/prefer-number-coercion": "off",
      "unicorn/prefer-simple-condition-first": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/prefer-unary-minus": "off",

      // @template-customization-end
    },
  },

  // @template-customization-start

  {
    files: ["scripts/*.ts"],
    rules: {
      "isaacscript/no-throw": "off",
    },
  },

  // @template-customization-end
);
