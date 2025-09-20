// // eslint.config.js
// import pluginRouter from '@tanstack/eslint-plugin-router'
// import js from '@eslint/js'

// export default [
//   js.configs.recommended,
//   ...pluginRouter.configs['flat/recommended'],
//   {
//     files: ['**/*.{js,jsx,ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//     },
//     settings: {
//       'import/resolver': {
//         alias: {
//           map: [['@', './src']],
//         },
//       },
//     },
//     rules: {
//       'no-console': 'warn',
//       'no-unused-vars': 'error',
//       'prefer-const': 'error',
//       'no-var': 'error',
//     },
//   },
//   {
//     ignores: ['dist/', 'node_modules/'],
//   },
// ]