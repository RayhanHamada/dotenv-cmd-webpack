import fs from "fs";
import path from "path";
import { Compiler, DefinePlugin } from "webpack";

import { WebpackEnvConfig } from "./types";
import { debug } from "./utils";

export class DotenvCmdWebpack extends DefinePlugin {
  private envObject: Record<string, any> = {};
  constructor(config: WebpackEnvConfig) {
    super({});
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

    let jsonFile: string;
    let parsedJsonFile;

    /**
     * read file from config.filePath and parse it
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

    /**
     * get the desired env object
     */
    const desiredEnv = parsedJsonFile[config.env];

    /**
     * and make an object to keep all the variables
     * in form of process.env.X, where X is the environment variable name
     */

    for (const key in desiredEnv) {
      this.envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
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

  apply(compiler: Compiler) {
    /**
     * add DefinePlugin to compiler's plugin
     */
    compiler.options.plugins?.push(
      new DefinePlugin({
        ...this.envObject,
      })
    );
  }
}
