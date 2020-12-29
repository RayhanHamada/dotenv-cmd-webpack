import fs from "fs";
import path from "path";
import { Compiler, DefinePlugin, EnvironmentPlugin } from "webpack";

import { WebpackEnvConfig } from "./types";
import { debug } from "./utils";

export function DotenvWebpack<EnvObject = string>(
  config: WebpackEnvConfig<EnvObject>
) {
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

  if (config.envObject !== undefined) {
    parsedJsonFile = config.envObject;
  } else if (config.filePath !== undefined) {
    /**
     * if undefined, read file from config.filePath and parse it
     */

    let resolvedPath: string;

    try {
      /**
       * resolve json file path
       */
      resolvedPath = config.shouldResolvePath
        ? path.resolve(process.cwd(), config.filePath)
        : config.filePath;

      debug(`resolved path -> ${resolvedPath}`, config.debug);
    } catch (e) {
      console.error(
        "dotenv-cmd-webpack    : Error when resolving path, please check your path !"
      );
      // console.error(
      //   `dotenv-cmd-webpack    : Proceeding to build WITHOUT your env variables set !`
      // );
      return new DefinePlugin({});
    }

    try {
      jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
      debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
    } catch (e) {
      console.error(
        `dotenv-cmd-webpack     : Error when reading file, check your JSON file !`
      );
      return new DefinePlugin({});
    }

    try {
      parsedJsonFile = JSON.parse(jsonFile);
      debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
    } catch (e) {
      console.error(
        `dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`
      );
      return new DefinePlugin({});
    }
  } else {
    console.error(
      `dotenv-cmd-webpack     : envObject or filePath is NOT specified !`
    );
    return new DefinePlugin({});
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
    console.log(
      `parsed json file:\n ${JSON.stringify(parsedJsonFile, null, 2)}`
    );
    console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
  }

  return new DefinePlugin({ ...envObject });
}

export class DotenvCmdWebpack<EnvObject = string> extends EnvironmentPlugin {
  [k: string]: string | ((...args: any[]) => void);
  constructor(config: WebpackEnvConfig<EnvObject>) {
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

    if (config.envObject !== undefined) {
      parsedJsonFile = config.envObject;
    } else if (config.filePath !== undefined) {
      /**
       * if undefined, read file from config.filePath and parse it
       */

      let resolvedPath: string;

      try {
        /**
         * resolve json file path
         */
        resolvedPath = config.shouldResolvePath
          ? path.resolve(process.cwd(), config.filePath)
          : config.filePath;

        debug(`resolved path -> ${resolvedPath}`, config.debug);
      } catch (e) {
        console.error(
          "dotenv-cmd-webpack    : Error when resolving path, please check your path !"
        );
        return;
      }

      try {
        jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
        debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
      } catch (e) {
        console.error(
          `dotenv-cmd-webpack     : Error when reading file, check your JSON file !`
        );
        return;
      }

      try {
        parsedJsonFile = JSON.parse(jsonFile);
        debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
      } catch (e) {
        console.error(
          `dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`
        );
        return;
      }
    } else {
      console.error(
        `dotenv-cmd-webpack     : envObject or filePath is NOT specified !`
      );
      return;
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
      envObject[key] = JSON.stringify(desiredEnv[key]);
    }

    super({
      ...envObject,
    });

    for (const key in desiredEnv) {
      this[key] = JSON.stringify(desiredEnv[key]);
    }

    if (config.debug) {
      console.log(
        `parsed json file:\n ${JSON.stringify(parsedJsonFile, null, 2)}`
      );
      console.log(
        `parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`
      );
    }
  }

  apply(compiler: Compiler) {}
}
