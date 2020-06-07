"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
function WebpackEnv(config) {
    /**
     * resolve json file path
     */
    const cwd = process.cwd();
    const resolvedPath = path_1.default.resolve(cwd, config.filePath);
    /**
     * read file from config.filePath and parse it
     */
    const jsonFile = fs_1.default.readFileSync(resolvedPath, { encoding: "utf-8" });
    const parsedJsonFile = JSON.parse(jsonFile);
    /**
     * get the desired env object
     */
    const desiredEnv = parsedJsonFile[config.env];
    /**
     * and make an object to keep all the variables
     * in form of process.env.X, where X is the variable name
     */
    let envObject = {};
    for (const key in desiredEnv) {
        envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
    }
    if (config.debug) {
        console.log(`parsed json file:\n ${JSON.stringify(parsedJsonFile, null, 2)}`);
        console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
    }
    return new webpack_1.DefinePlugin({ ...desiredEnv });
}
WebpackEnv.prototype.apply = function (compiler) { };
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
exports.default = WebpackEnv;
