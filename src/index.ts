import fs from "fs";
import path from "path";
import { Compiler, Plugin } from "webpack";

import { WebpackEnvConfig } from "./types";

class WebpackEnv<EnvObject = string> extends Plugin {
  constructor(public readonly config: WebpackEnvConfig<EnvObject>) {
    super();
  }

  apply(compiler: Compiler): void {
    /**
     * resolve json file path
     */
    const cwd = process.cwd();
    const resolvedPath = path.resolve(cwd, this.config.filePath);

    /**
     * read file from config.filePath and parse it
     */
    const jsonFile = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
    const parsedJsonFile = JSON.parse(jsonFile);

    /**
     * take the desired environment's keys
     */
    const desiredEnvObject = parsedJsonFile[this.config.env as string];
    const desiredEnvKeys = Object.keys(desiredEnvObject);

    /**
     * and set the environment, but leave the predefined variable
     */
    desiredEnvKeys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsedJsonFile[this.config.env as string][key];
      }
    });
  }
}

export default WebpackEnv;
