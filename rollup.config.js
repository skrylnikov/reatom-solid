import babel from 'rollup-plugin-babel';

const plugins = [
  babel({
    extensions: ['.js', '.ts'],
    presets: ["@babel/preset-typescript"],
    exclude: 'node_modules/**'
  })
];

export default {
  input: 'src/index.ts',
  output: [{
    file: 'lib//index.js',
    format: 'cjs'
  }, {
    file: 'dist//index.js',
    format: 'es'
  }],
  external: ['solid-js', '@reatom/core'],
  plugins
};