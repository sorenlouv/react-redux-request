/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const pascalCase = require('pascal-case');
const prettyBytes = require('pretty-bytes');
const rimraf = require('rimraf');
const { execSync } = require('child_process');

process.chdir(path.resolve(__dirname, '..'));

const packageName = 'react-redux-request';
const packageNamePascal = pascalCase(packageName);

rimraf.sync('./dist');

execSync(
  `rollup --config scripts/config.js --format es --file dist/esm/${packageName}.js`
);

execSync(
  `rollup --config scripts/config.js --format cjs --file dist/cjs/${packageName}.js`
);

execSync(
  `rollup --config scripts/config.js --format umd --name ${packageNamePascal} --file dist/umd/${packageName}.js`
);

execSync(
  `BUILD_ENV=production rollup --config scripts/config.js --format umd --name ${packageNamePascal} --file dist/umd/${packageName}.min.js`
);

console.log(
  '\n📦  The minified, gzipped UMD build is %s',
  prettyBytes(gzipSize.sync(fs.readFileSync(`dist/umd/${packageName}.min.js`)))
);
