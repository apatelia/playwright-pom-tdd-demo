import globals from "globals";
import pluginJs from "@eslint/js";
import teslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,ts}"]
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
  eslintConfigPrettier,
  {
    rules: {
      "eol-last": ["error", "always"],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/unified-signatures": "error"
    }
  }
];
