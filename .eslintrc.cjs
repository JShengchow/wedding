module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unknown-property": ["error", { ignore: ["fetchpriority"] }],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: ["dist", "node_modules", "scripts/optimize-images.mjs"],
};
