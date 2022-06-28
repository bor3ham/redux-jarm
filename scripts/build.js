
const esbuild = require('esbuild')

module.exports.config = {
  bundle: true,
  sourcemap: true,
  minify: true,
  format: 'esm',
  target: ['esnext'],
  entryPoints: ['src/index.js'],
  outfile: 'dist/redux-jarm.js',
  external: [
    'redux',
    'redux-thunk',
  ],
}

esbuild.build(module.exports.config).catch(() => process.exit(1))
