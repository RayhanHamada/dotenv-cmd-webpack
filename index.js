"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
class WebpackEnv extends webpack_1.Plugin {
    constructor(config) {
        super();
        this.config = config;
    }
    apply(compiler) {
        /**
         * resolve json file path
         */
        const cwd = process.cwd();
        const resolvedPath = path_1.default.resolve(cwd, this.config.filePath);
        /**
         * read file from config.filePath and parse it
         */
        const jsonFile = fs_1.default.readFileSync(resolvedPath, { encoding: "utf-8" });
        const parsedJsonFile = JSON.parse(jsonFile);
        /**
         * take the desired environment's keys
         */
        const desiredEnvKeys = Object.keys(parsedJsonFile[this.config.env]);
        /**
         * and set the environment, but leave the predefined variable
         */
        desiredEnvKeys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
                process.env[key] = parsedJsonFile[this.config.env][key];
            }
        });
    }
}
exports.default = WebpackEnv;
