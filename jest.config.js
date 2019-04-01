const path = require('path');
const env = require('minimist')(process.argv.slice(2));

const dir = path.dirname(require.resolve('./gulp/estatico-jest-2'));

module.exports = {
  globalSetup: path.join(dir, './setup.js'),
  globalTeardown: path.join(dir, './teardown.js'),
  testEnvironment: path.join(dir, './environment.js'),
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  projects: [{
    // This seems to be the only way for now to pass options to setup.js
    // https://github.com/facebook/jest/issues/5957#issuecomment-422027349
    puppeteerServer: {
      port: 3005,
      dir: './dist',
      puppeteer: {
        // Our current Teamcity agents expect Puppeteer to run in no-sandbox mode
        args: env.ci ? ['--no-sandbox'] : ['--no-sandbox'],
      },
    },
  }],
};
