import { DefinePlugin } from 'webpack';
import { WebpackEnvConfig } from './types';
export declare function DotenvWebpack<EnvObject = string>(config: WebpackEnvConfig<EnvObject>): DefinePlugin;
