import fs from 'fs';
import path from 'path';
import { DefinePlugin } from 'webpack';

import { WebpackEnvConfig } from './types';
import { debug } from './utils';

export function dotenvCmdWebpack(config: WebpackEnvConfig) {
  /**
   * should path to .env file be resolved or not
   */
  if (config.shouldResolvePath === undefined) {
    config.shouldResolvePath = true;
  }

  /**
   * should plugin logging data
   */
  if (config.debug === undefined) {
    config.debug = false;
  }
  /**
   * if config.envObject is not undefined, just use the envObject
   * instead of reading the json file and parse it
   */

  let jsonFile: string;
  let parsedJsonFile;

  /**
   * if undefined, read file from config.filePath and parse it
   */

  let filePath: string;

  try {
    /**
     * resolve json file path
     */
    filePath = config.shouldResolvePath
      ? path.resolve(process.cwd(), config.filePath)
      : config.filePath;

    debug(`resolved path -> ${filePath}`, config.debug);
  } catch (e) {
    throw new Error(
      'dotenv-cmd-webpack    : Error when resolving path, please check your path !'
    );
  }

  try {
    jsonFile = fs.readFileSync(filePath, { encoding: 'utf-8' });
    debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
  } catch (e) {
    throw new Error(
      `dotenv-cmd-webpack     : Error when reading file, check your JSON file !`
    );
  }

  try {
    parsedJsonFile = JSON.parse(jsonFile);
    debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
  } catch (e) {
    throw new Error(
      `dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`
    );
  }

  /**
   * get the desired env object
   */
  const desiredEnv = parsedJsonFile[config.env];

  /**
   * and make an object to keep all the variables
   * in form of process.env.X, where X is the variable name
   */
  let envObject: Record<string, string> = {};

  for (const key in desiredEnv) {
    envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
  }

  if (config.debug) {
    console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
  }

  return new DefinePlugin({ ...envObject });
}
