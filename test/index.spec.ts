import path from 'path';
import fs from 'fs';

import webpack, { Configuration } from 'webpack';
import { expect } from 'chai';

import { dotenvCmdWebpack, DotenvCmdWebpack } from '../src/index';

describe.skip('DotenvCmdWebpack class', function () {
  this.beforeAll(function (done) {
    fs.promises
      .unlink(path.resolve(__dirname, 'mockGenerated.js'))
      .then(() => {
        console.log(`mockGenerated.js deleted !`);
        done();
      })
      .catch(() => {
        console.log(`failed to delete mockGenerated.js`);
        done();
      });
  });

  it('should read file with no error', function () {
    expect(
      new DotenvCmdWebpack({
        filePath: path.resolve(__dirname, '.env.json'),
        env: 'dev',
      })
    ).to.not.throw;
  });

  const plugin = new DotenvCmdWebpack({
    filePath: path.resolve(__dirname, '.env.json'),
    env: 'dev',
  });

  const config: Configuration = {
    mode: 'production',
    entry: {
      mockGenerated: path.resolve(__dirname, 'mock.js'),
    },
    output: {
      path: __dirname,
    },
  };

  it('should be accepted by webpack() with no error', function (done) {
    webpack(
      {
        ...config,
        plugins: [plugin],
      },
      function (_err, stats) {
        expect(stats.hasErrors()).to.be.false;
        expect(stats.compilation.errors).to.be.empty;
        done();
      }
    );
  });

  it(`change "process.env.PORT" to "3000" in mockGenerated.js`, function (done) {
    fs.promises
      .readFile(path.resolve(__dirname, 'mockGenerated.js'), {
        encoding: 'utf-8',
      })
      .then(code => {
        expect(code).to.contain(`"3000"`);
        done();
      })
      .catch(() => {
        expect.fail('failed to open mockGenerated.js');
      });
  });
});

describe('dotenvCmdWebpack', function () {
  this.beforeAll(function (done) {
    fs.promises
      .unlink(path.resolve(__dirname, 'mockGenerated.js'))
      .then(() => {
        console.log(`mockGenerated.js deleted !`);
        done();
      })
      .catch(() => {
        console.log(`failed to delete mockGenerated.js`);
        done();
      });
  });

  it('should read file with no error', function () {
    expect(
      dotenvCmdWebpack({
        filePath: path.resolve(__dirname, '.env.json'),
        env: 'dev',
      })
    ).to.not.throw;
  });

  const config: Configuration = {
    mode: 'production',
    output: {
      path: __dirname,
    },
  };

  const plugin = dotenvCmdWebpack({
    filePath: path.resolve(__dirname, '.env.json'),
    env: 'dev',
  });

  describe.skip('for javascript files', function () {
    this.beforeAll(function (done) {
      fs.promises
        .unlink(path.resolve(__dirname, 'mockGenerated.js'))
        .then(() => {
          console.log(`mockGenerated.js deleted !`);
          done();
        })
        .catch(() => {
          console.log(`failed to delete mockGenerated.js`);
          done();
        });
    });

    it('should be accepted by webpack() with no error (javascript entry)', function (done) {
      webpack(
        {
          ...config,
          entry: {
            mockGenerated: path.resolve(__dirname, 'mock.js'),
          },
          plugins: [plugin],
        },
        function (_err, stats) {
          expect(stats.hasErrors()).to.be.false;
          expect(stats.compilation.errors).to.be.empty;
          done();
        }
      );
    });

    it(`change "process.env.PORT" to "3000" in mockGenerated.js (from mock.js)`, function (done) {
      fs.promises
        .readFile(path.resolve(__dirname, 'mockGenerated.js'), {
          encoding: 'utf-8',
        })
        .then(code => {
          expect(code).to.contain(`"3000"`);
          done();
        })
        .catch(() => {
          expect.fail('failed to open mockGenerated.js');
        });
    });
  });

  describe('for typescript files', function () {
    this.beforeAll(function (done) {
      fs.promises
        .unlink(path.resolve(__dirname, 'mockGenerated.js'))
        .then(() => {
          console.log(`mockGenerated.js deleted !`);
          done();
        })
        .catch(() => {
          console.log(`failed to delete mockGenerated.js`);
          done();
        });
    });

    it('should be accepted by webpack() with no error (typescript entry)', function (done) {
      webpack(
        {
          ...config,
          entry: {
            mockGenerated: path.resolve(__dirname, 'mock.js'),
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                loader: 'ts-loader',
              },
            ],
          },
          plugins: [plugin],
        },
        function (_err, stats) {
          expect(stats.hasErrors()).to.be.false;
          expect(stats.compilation.errors).to.be.empty;
          done();
        }
      );
    });

    it(`change "process.env.PORT" to "3000" in mockGenerated.js (from mock.ts)`, function (done) {
      fs.promises
        .readFile(path.resolve(__dirname, 'mockGenerated.js'), {
          encoding: 'utf-8',
        })
        .then(code => {
          expect(code).to.contain(`"3000"`);
          done();
        })
        .catch(() => {
          expect.fail('failed to open mockGenerated.js');
        });
    });
  });
});
