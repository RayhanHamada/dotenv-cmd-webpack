import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import webpack, { Configuration } from 'webpack';
import { DotenvCmdWebpack } from '../src/index';

describe('DotenvCmdWebpack class', function () {
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
