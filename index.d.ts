import { Compiler, DefinePlugin } from 'webpack';
import { WebpackEnvConfig } from './types';
export declare function dotenvCmdWebpack(config: WebpackEnvConfig): DefinePlugin;
export declare class DotenvCmdWebpack extends DefinePlugin {
    private config;
    constructor(config: WebpackEnvConfig);
    apply(compiler: Compiler): void;
}
