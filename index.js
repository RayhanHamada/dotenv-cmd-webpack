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
        this.config = config;
    }
    apply(compiler) {
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
            filePath = this.config.shouldResolvePath
                ? path_1.default.resolve(process.cwd(), this.config.filePath)
                : this.config.filePath;
            utils_1.debug(`resolved path -> ${filePath}`, this.config.debug);
        }
        catch (e) {
            throw new Error('dotenv-cmd-webpack    : Error when resolving path, please check your path !');
        }
        try {
            jsonFile = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
            utils_1.debug(`jsonFile -> ${JSON.stringify(jsonFile)}`, this.config.debug);
        }
        catch (e) {
            throw new Error(`dotenv-cmd-webpack     : Error when reading file, check your JSON file !`);
        }
        try {
            parsedJsonFile = JSON.parse(jsonFile);
            utils_1.debug(`parsedJsonFile -> ${JSON.stringify(jsonFile)}`, this.config.debug);
        }
        catch (e) {
            throw new Error(`dotenv-cmd-webpack     : Error when parsing file, check your JSON file !`);
        }
        /**
         * get the desired env object
         */
        const desiredEnv = parsedJsonFile[this.config.env];
        /**
         * and make an object to keep all the variables
         * in form of process.env.X, where X is the variable name
         */
        let envObject = {};
        for (const key in desiredEnv) {
            envObject[`process.env.${key}`] = JSON.stringify(desiredEnv[key]);
        }
        if (this.config.debug) {
            console.log(`parsed desiredEnv:\n ${JSON.stringify(desiredEnv, null, 2)}`);
        }
        compiler.options.plugins.push(new webpack_1.DefinePlugin({
            ...envObject,
        }));
    }
}
exports.DotenvCmdWebpack = DotenvCmdWebpack;
