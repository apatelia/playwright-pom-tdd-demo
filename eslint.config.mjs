import globals from "globals";
import pluginJs from "@eslint/js";
import teslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import deprecated from "eslint-plugin-deprecate";
import playwright from "eslint-plugin-playwright";

export default [
  {
    files: [ "**/*.{js,ts}" ]
  },
  {
    ignores: [
      "eslint.config.mjs",
      "node_modules/*",
      "test-report/*",
      "test-results/*"
    ]
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  pluginJs.configs.recommended,
  ...teslint.configs.recommended,
  ...teslint.configs.stylistic,
  {
    plugins: {
      "unused-imports": unusedImports,
      "deprecated": deprecated,
    }
  },
  {
    ...playwright.configs[ "flat/recommended" ],
    files: [ "tests/**", "pages/**" ]
  },
  {
    files: [ "tests/**", "pages/**" ],
    rules: {
      "playwright/no-commented-out-tests": "error",
      "playwright/prefer-lowercase-title": "warn",
      "playwright/require-soft-assertions": "error",
      "playwright/prefer-equality-matcher": "error",
      "playwright/prefer-strict-equal": "error",
      "playwright/prefer-to-have-count": "error",
      "playwright/prefer-to-have-length": "error",
      "playwright/no-raw-locators": "warn",
    },
  },
  {
    rules: {
      "quotes": [ "error", "double" ],
      "semi": [ "error", "always" ],
      "linebreak-style": [ "error", "unix" ],
      "one-var-declaration-per-line": [ "error", "always" ],
      "no-unused-vars": "error",
      "eqeqeq": "error",
      "no-console": "error",
      "array-bracket-spacing": [ "error", "always" ],
      "object-curly-spacing": [ "error", "always" ],
      "comma-dangle": [ "error", "only-multiline" ],
      "eol-last": [ "error", "always" ],
      "unused-imports/no-unused-imports": "error",
      "no-warning-comments": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variableLike", format: [ "camelCase" ] },
        { selector: "memberLike", format: [ "camelCase" ] },
        {
          selector: "memberLike",
          modifiers: [ "private" ],
          format: [ "camelCase" ],
          leadingUnderscore: "require"
        },
        { selector: "typeLike", format: [ "PascalCase" ] },
        {
          selector: "interface",
          format: [ "PascalCase" ],
          custom: {
            regex: "^I[A-Z]",
            match: false
          }
        },
        {
          selector: "function",
          format: [ "camelCase" ]
        }
      ]
    }
  }
];
