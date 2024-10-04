import globals from "globals";
import pluginJs from "@eslint/js";
import teslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

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
      "unused-imports": unusedImports
    }
  },
  {
    rules: {
      "quotes": [ "error", "double" ],
      semi: [ "error", "always" ],
      "one-var-declaration-per-line": [ "error", "always" ],
      "no-unused-vars": "error",
      camelcase: "error",
      eqeqeq: "error",
      "no-console": "error",
      "array-bracket-spacing": [ "error", "always" ],
      "object-curly-spacing": [ "error", "always" ],
      "comma-dangle": [ "error", "always-multiline" ],
      "eol-last": [ "error", "always" ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/unified-signatures": "error",
    }
  }
];
