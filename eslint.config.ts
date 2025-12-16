import type { Linter } from "eslint";
import imp from "eslint-plugin-import";
import a11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleSort from "eslint-plugin-simple-import-sort";
import unused from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const config: Linter.Config[] = [
  {
    ignores: [
      "eslint.config.*",
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "**/.vite/**",
      "node_modules/.vite/**",
      "**/temp/**",
      "**/.cache/**",
      "**/*.{js,jsx,mjs,cjs}",
      ".__mf__temp/**"
    ]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: process.cwd()
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": a11y,
      import: imp,
      "simple-import-sort": simpleSort,
      "unused-imports": unused
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.eslint.json",
          alwaysTryTypes: true
        }
      }
    },
    rules: {
      "react/prop-types": "off",
      "react/jsx-no-leaked-render": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",

      "no-undef": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        fixStyle: "separate-type-imports"
      }],
      "@typescript-eslint/require-await": "off",

      "no-console": ["warn", { allow: ["warn", "error", "log"] }],

      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_"
      }],
      "import/order": "off",
      "sort-imports": "off",

      "import/no-extraneous-dependencies": ["error", { packageDir: ["./"] }],
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "import/no-relative-parent-imports": "off",
      "no-restricted-imports": ["error", {
        patterns: ["../*", "../../*", "../../../*", "../../../../*"]
      }]
    }
  },
  {
    files: ["**/*.config.{ts,mts,cts}", "vite.config.*", "scripts/**/*.{ts}"],
    rules: { "import/no-relative-parent-imports": "off" }
  }
];

export default config;
