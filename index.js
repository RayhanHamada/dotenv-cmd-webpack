"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotenvCmdWebpack = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const utils_1 = require("./utils");
class DotenvCmdWebpack extends webpack_1.DefinePlugin {
    constructor(config) {
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
        let jsonFile;
        let parsedJsonFile;
        /**
         * read file from config.filePath and parse it
         */
        let filePath;
        try {
            /**
             * resolve json file path
             */
            filePath = config.shouldResolvePath
                ? path_1.default.resolve(process.cwd(), config.filePath)
                : config.filePath;
            utils_1.debug(`resolved path -> ${filePath}`, config.debug);
        }
        catch (e) {
            console.error('dotenv-cmd-webpack    : Error when resolving path, please check your path !');
            return;
        }
        try {
            jsonFile = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
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
        /**
         * get the desired env object
         */
        const desiredEnv = parsedJsonFile[config.env];
        /**
         * and make an object to keep all the variables
         * in form of process.env.X, where X is the environment variable name
         */
        for (const key in desiredEnv) {
            this.definitions[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
        }
        if (config.debug) {
            console.log(`parsed json file:\n ${JSON.stringify(parsedJsonFile, null, 2)}`);
            console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
        }
    }
    apply(_compiler) { }
}
exports.DotenvCmdWebpack = DotenvCmdWebpack;
