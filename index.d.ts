import { Plugin } from 'webpack';
import { WebpackEnvConfig } from './types';
export declare class DotenvCmdWebpack<EnvObject = string> extends Plugin {
    constructor(config: WebpackEnvConfig<EnvObject>);
}
