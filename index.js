"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const utils_1 = require("./utils");
function WebpackEnv(config) {
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
    let jsonFile;
    let parsedJsonFile;
    if (config.envObject !== undefined) {
        parsedJsonFile = config.envObject;
    }
    else if (config.filePath !== undefined) {
        /**
         * if undefined, read file from config.filePath and parse it
         */
        let resolvedPath;
        try {
            /**
             * resolve json file path
             */
            resolvedPath = config.shouldResolvePath
                ? path_1.default.resolve(process.cwd(), config.filePath)
                : config.filePath;
            utils_1.debug(`resolved path -> ${resolvedPath}`, config.debug);
        }
        catch (e) {
            console.error("dotenv-cmd-webpack    : Error when resolving path, please check your path !");
            // console.error(
            //   `dotenv-cmd-webpack    : Proceeding to build WITHOUT your env variables set !`
            // );
            return;
        }
        try {
            jsonFile = fs_1.default.readFileSync(resolvedPath, { encoding: "utf-8" });
            utils_1.debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
        }
        catch (e) {
            console.error(`dotenv-cmd-webpack     : Error when reading file, check your JSON file !`);
            return;
        }
        try {
            parsedJsonFile = JSON.parse(jsonFile);
            utils_1.debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, config.debug);
        }
        catch (e) {
            console.error(`dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`);
            return;
        }
    }
    else {
        console.error(`dotenv-cmd-webpack     : envObject or filePath is NOT specified !`);
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
    let envObject = {};
    for (const key in desiredEnv) {
        envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
    }
    if (config.debug) {
        console.log(`parsed json file:\n ${JSON.stringify(parsedJsonFile, null, 2)}`);
        console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
    }
    return new webpack_1.DefinePlugin({ ...envObject });
}
WebpackEnv.prototype.apply = function (compiler) { };
exports.default = WebpackEnv;
