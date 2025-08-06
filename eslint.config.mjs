import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow 'any' types for rapid development and complex integrations
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars in certain cases (like catch blocks)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // Make React hooks dependency warnings instead of errors
      "react-hooks/exhaustive-deps": "warn",
      // Allow unescaped entities - they're often fine in practice
      "react/no-unescaped-entities": "warn",
    }
  }
];

export default eslintConfig;
