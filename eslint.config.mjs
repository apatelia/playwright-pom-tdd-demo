import eslintJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import teslint from "typescript-eslint";

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
  eslintJs.configs.recommended,
  ...teslint.configs.recommended,
  ...teslint.configs.stylistic,
  {
    plugins: {
      "@stylistic": stylistic,
      "unused-imports": unusedImports,
    }
  },
  {
    ...playwright.configs[ "flat/recommended" ],
    files: [ "tests/**", "pages/**" ],
    rules: {
      "playwright/no-commented-out-tests": "error",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": [ "error", { "allowConditional": true } ],
      "playwright/valid-title": "error",
      "playwright/prefer-lowercase-title": [ "warn", { "ignore": [ "test.describe" ], "ignoreTopLevelDescribe": true } ],
      "playwright/require-soft-assertions": "warn",
      "playwright/prefer-web-first-assertions": "error",
      "playwright/prefer-comparison-matcher": "error",
      "playwright/prefer-equality-matcher": "error",
      "playwright/prefer-strict-equal": "error",
      "playwright/prefer-to-have-count": "error",
      "playwright/prefer-to-have-length": "error",
      "playwright/prefer-native-locators": [ "error", { "testIdAttribute": "data-test" } ],
      "playwright/no-raw-locators": "warn",
      "playwright/no-networkidle": "error",
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-wait-for-selector": "error",
      "playwright/no-eval": "error",
    },
  },
  {
    "settings": {
      "playwright": {
        "messages": {
          "noWaitForTimeout": "Avoid using 'page.waitForTimeout()'. It makes tests unreliable. Use Playwright's web first assertions instead.",
          "noWaitForSelector": "Use of 'page.waitForSelector()' is discouraged. Use 'locator.waitFor()' instead.",
          "noNetworkidle": "Do not wait for 'NetworkIdle' load-state. It is discouraged. Use Playwright's web first assertions instead.",
          "noFocusedTest": "Remove 'Only' annotation. Focused tests are not allowed in source code repository.",
          "noSkippedTest": "Remove 'Skip' annotation. Skipped tests are not allowed in source code repository.",
          "commentedTests": "Remove commented test. Commented tests are not allowed in source code repository.",
          "noEval": "Do not use 'page.$eval()'. Use 'locator.evaluate()' instead.",
          "noEvalAll": "Do not use 'page.$$eval()'. Use 'locator.evaluateAll()' instead.",
          "requireSoft": "Try to use 'expect.soft()' assertion. Use of 'expect.soft()' assertion is a recommended practice."
        }
      }
    }
  },
  {
    rules: {
      "eqeqeq": [ "error", "smart" ],
      "no-console": "error",
      "no-warning-comments": "warn",
      "unused-imports/no-unused-imports": "error",
      "@stylistic/quotes": [ "error", "double" ],
      "@stylistic/semi": [ "error", "always" ],
      "@stylistic/one-var-declaration-per-line": [ "error", "always" ],
      "@stylistic/object-curly-spacing": [ "error", "always" ],
      "@stylistic/indent": [ "error", 2 ],
      "@stylistic/linebreak-style": [ "error", "unix" ],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/array-bracket-newline": [ "error", { "multiline": true } ],
      "@stylistic/array-bracket-spacing": [ "error", "always" ],
      "@stylistic/block-spacing": [ "error", "always" ],
      "@stylistic/comma-dangle": [ "error", "only-multiline" ],
      "@stylistic/comma-spacing": [ "error", { "before": false, "after": true } ],
      "@stylistic/eol-last": [ "error", "always" ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-deprecated": "error",
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
