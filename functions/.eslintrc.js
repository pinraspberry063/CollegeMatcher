module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", {code: 120}], // Increased from 80 to 120
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
};
