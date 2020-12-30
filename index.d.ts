import { Compiler, DefinePlugin } from 'webpack';
import { WebpackEnvConfig } from './types';
export declare class DotenvCmdWebpack extends DefinePlugin {
    constructor(config: WebpackEnvConfig);
    apply(_compiler: Compiler): void;
}
