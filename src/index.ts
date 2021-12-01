import fs from 'fs';
import path from 'path';
import { Compiler, DefinePlugin } from 'webpack';
import { WebpackEnvConfig } from './types';
import { debug } from './utils';

export class DotenvCmdWebpack extends DefinePlugin {
  constructor(private config: WebpackEnvConfig) {
    super({});
  }

  apply(compiler: Compiler) {
    /**
     * should path to .env file be resolved or not
     */
    if (this.config.shouldResolvePath === undefined) {
      this.config.shouldResolvePath = true;
    }

    /**
     * should plugin logging data
     */
    if (this.config.debug === undefined) {
      this.config.debug = false;
    }

    let jsonFile: string;
    let parsedJsonFile;

    /**
     * read file from config.filePath and parse it
     */

    let filePath: string;

    try {
      /**
       * resolve json file path
       */
      filePath = this.config.shouldResolvePath
        ? path.resolve(process.cwd(), this.config.filePath)
        : this.config.filePath;

      debug(`resolved path -> ${filePath}`, this.config.debug);
    } catch (e) {
      throw new Error(
        'dotenv-cmd-webpack    : Error when resolving path, please check your path !'
      );
    }

    try {
      jsonFile = fs.readFileSync(filePath, { encoding: 'utf-8' });
      debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, this.config.debug);
    } catch (e) {
      throw new Error(
        `dotenv-cmd-webpack     : Error when reading file, check your JSON file !`
      );
    }

    try {
      parsedJsonFile = JSON.parse(jsonFile);
      debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, this.config.debug);
    } catch (e) {
      throw new Error(
        `dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`
      );
    }

    /**
     * get the desired env object
     */
    const desiredEnv = parsedJsonFile[this.config.env];

    /**
     * and make an object to keep all the variables
     * in form of process.env.X, where X is the variable name
     */
    let envObject: Record<string, string> = {};

    for (const key in desiredEnv) {
      envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
    }

    if (this.config.debug) {
      console.log(
        `parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`
      );
    }

    (compiler.options.plugins as any[]).push(
      new DefinePlugin({
        ...envObject,
      })
    );
  }
}
