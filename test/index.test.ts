import webpack from 'webpack';
import { DotenvCmdWebpack } from '../src/index';
import { expect } from 'chai';

describe('DotenvCmdWebpack', function () {
  it('should accept config with no error', function (done) {
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
        plugins: [
          new DotenvCmdWebpack({
            env: 'dev',
            filePath: './test/.env.json',
          }),
        ],
      },
      function (_err, stats) {
        expect(stats.hasErrors(), 'compilation should have no error').to.be
          .false;
        const thePlugin = stats.compilation.compiler.options.plugins[0];

        expect(thePlugin, 'thePlugin should not be undefined').not.to.be
          .undefined;

        expect(
          (thePlugin as any).envObject['process.env.PORT'],
          'process.env.PORT should be 3000'
        ).to.be.equal('3000');

        done();
      }
    );
  });
});
