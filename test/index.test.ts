import path from 'path';
import fs from 'fs';
import webpack, { Configuration } from 'webpack';
import { expect } from 'chai';

import { dotenvCmdWebpack } from '../src/index';

const config: Configuration = {
  mode: 'production',
  entry: {
    mockGenerated: path.resolve(__dirname, 'mock.js'),
  },
  output: {
    path: __dirname,
  },
};

describe('dotenvCmdWebpack function', function () {
  it('should read file with no error', function () {
    expect(
      dotenvCmdWebpack({
        filePath: path.resolve(__dirname, '.env.json'),
        env: 'dev',
      })
    ).to.not.throw;
  });

  const plugin = dotenvCmdWebpack({
    filePath: path.resolve(__dirname, '.env.json'),
    env: 'dev',
  });

  it('should have process.env.PORT defined and set to 3000', function () {
    expect(plugin.definitions['process.env.PORT']).to.be.not.undefined;
    expect(plugin.definitions['process.env.PORT']).to.be.eq(`"3000"`);
  });

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
        console.log(code);
        done();
      })
      .catch(() => {
        expect.fail('failed to open mockGenerated.js');
      });
  });
});
