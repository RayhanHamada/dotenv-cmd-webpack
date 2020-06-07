import fs from "fs";
import path from "path";
import { DefinePlugin } from "webpack";

import { WebpackEnvConfig } from "./types";

function WebpackEnv<EnvObject = string>(config: WebpackEnvConfig<EnvObject>) {
  /**
   * resolve json file path
   */
  const cwd = process.cwd();
  const resolvedPath = path.resolve(cwd, config.filePath);

  /**
   * read file from config.filePath and parse it
   */
  const jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
  const parsedJsonFile = JSON.parse(jsonFile);

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
    envObject[`process.env.${key}`] = desiredEnv[key];
  }

  return new DefinePlugin(envObject);
}

// class WebpackEnv<EnvObject = string> extends Plugin {
//   constructor(public readonly config: WebpackEnvConfig<EnvObject>) {
//     super();
//   }

//   apply(compiler: Compiler): void {
//     /**
//      * resolve json file path
//      */
//     const cwd = process.cwd();
//     const resolvedPath = path.resolve(cwd, this.config.filePath);

//     /**
//      * read file from config.filePath and parse it
//      */
//     const jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
//     const parsedJsonFile = JSON.parse(jsonFile);

//     /**
//      * take the desired environment's keys
//      */
//     const desiredEnvObject = parsedJsonFile[this.config.env as string];
//     const desiredEnvKeys = Object.keys(desiredEnvObject);

//     /**
//      * and set the environment, but leave the predefined variable
//      */
//     desiredEnvKeys.forEach((key) => {
//       if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
//         process.env[key] = parsedJsonFile[this.config.env as string][key];
//       }
//     });
//   }
// }

export default WebpackEnv;
