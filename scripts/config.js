/* eslint-disable import/no-extraneous-dependencies */

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const getPlugins = (isProduction = false) => {
  const plugins = [
    commonjs({
      include: /node_modules/
    }),
    resolve(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      presets: [
        'stage-1',
        [
          'env',
          {
            modules: false
          }
        ]
      ],
      plugins: [
        'external-helpers',
        [
          'transform-runtime',
          {
            helpers: false,
            polyfill: false,
            regenerator: true
          }
        ]
      ],
      babelrc: false
    })
  ];

  if (isProduction) {
    plugins.push(uglify({}, minify));
  }

  return plugins;
};

function getConfig() {
  const isProduction = process.env.BUILD_ENV === 'production';
  console.log('loklz');
  return {
    input: 'src/index.js',
    output: {
      globals: {
        react: 'React',
        'react-redux': 'ReactRedux'
      }
    },
    external: ['react', 'react-redux', 'crypto'],
    plugins: getPlugins(isProduction)
  };
}

export default getConfig({});
