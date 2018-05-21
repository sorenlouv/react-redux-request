/* eslint-disable import/no-extraneous-dependencies */

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

function getBabelConfig(env) {
  const plugins = [
    'external-helpers',
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true
      }
    ]
  ];

  if (env === 'production') {
    plugins.push(['transform-react-remove-prop-types', { removeImport: true }]);
  }

  return {
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
    plugins,
    babelrc: false
  };
}

function getRollupPlugins(env) {
  const plugins = [resolve()];

  if (env) {
    plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    );
  }

  plugins.push(
    commonjs({
      include: /node_modules/
    }),
    babel(getBabelConfig(env))
  );

  if (env === 'production') {
    plugins.push(uglify({}, minify));
  }

  return plugins;
}

function getConfig() {
  const env = process.env.BUILD_ENV;
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
    plugins: getRollupPlugins(env)
  };
}

export default getConfig({});
