module.exports = {
  root: 'packages/bolt',
  eyeglass: {
    enableImportOnce: false
  },
  lint: false,
  sassdoc: {
    dest: './dist/sassdoc'
  },
  sourceMaps: process.env.NODE_ENV !== 'production',
  failAfterError: false,
  glob: false,
  extraWatches: [
    './src/_patterns/**/*.scss',
    '!./src/_patterns/**/tests/**',
    '!**/node_modules/**'
  ],
  src: [
    './packages/bolt/bolt.scss'
  ],
  data: './src/_data',
  dest: './dist/styles'
};
