module.exports = {
  bracketSpacing: true,
  bracketSameLine: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  semi: true,
  printWidth: 110,
  arrowParens: 'always',
  plugins: [
    /**
     * **NOTE** tailwind plugin must come last!
     * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
     */
    'prettier-plugin-tailwindcss',
  ],
};
