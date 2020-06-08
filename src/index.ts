import fs from "fs";
import path from "path";
import { DefinePlugin, Compiler } from "webpack";

import { WebpackEnvConfig } from "./types";

function WebpackEnv<EnvObject = string>(config: WebpackEnvConfig<EnvObject>) {
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

    try {
      /**
       * resolve json file path
       */
      const cwd = process.cwd();
      const resolvedPath = path.resolve(cwd, config.filePath);
      jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
      parsedJsonFile = JSON.parse(jsonFile);
    } catch (e) {
      console.error(
        "dotenv-cmd-webpack    : Error when reading json file or resolving path, please check your path, current working directory, or the json file !"
      );
      console.error(
        `dotenv-cmd-webpack    : Proceeding to build WITHOUT your env variables set !`
      );
      return;
    }
  } else {
    console.error(
      `dotenv-cmd-webpack     : envObject or filePath is NOT specified !`
    );
    console.error(
      `dotenv-cmd-webpack    : Proceeding to build WITHOUT your env variables set !`
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

WebpackEnv.prototype.apply = function (compiler: Compiler) {};

export default WebpackEnv;
