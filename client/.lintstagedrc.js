const path = require("path");

const buildEslintCommand = (filenames) =>
  `npx eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

const buildPrettierCommand = (filenames) => `prettier --write ${filenames.join(" ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, buildPrettierCommand],
  "*.{json,css,scss,md,html}": [buildPrettierCommand],
};
