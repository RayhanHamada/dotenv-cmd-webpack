import webpack from 'webpack';
import { expect } from 'chai';

import { DotenvCmdWebpack } from '../src/index';

describe('DotenvCmdWebpack', function () {
  const plugin = new DotenvCmdWebpack({
    env: 'dev',
    filePath: './test/.env.json',
  });

  it('Plugin should have process.env.PORT set to 3000', function (done) {
    expect(plugin).to.be.not.undefined;
    expect(plugin.definitions['process.env.PORT']).to.be.equal('3000');
    done();
  });

  it('Webpack should accept plugin with no error', function (done) {
    webpack(
      {
        mode: 'development',
        entry: './test/mock.html',
        module: {
          rules: [
            {
              test: /\.html/i,
              loader: 'html-loader',
            },
          ],
        },
        plugins: [plugin],
      },
      function (_err, stats) {
        expect(stats.hasErrors(), 'compilation should have no error').to.be
          .false;

        const thePlugin = stats.compilation.compiler.options
          .plugins[0] as DotenvCmdWebpack;

        expect(thePlugin, 'thePlugin should not be undefined').not.to.be
          .undefined;

        expect(
          thePlugin.definitions['process.env.PORT'],
          'process.env.PORT should be 3000'
        ).to.be.equal('3000');
        
        done();
      }
    );
  });
});
