import { Compiler, DefinePlugin, EnvironmentPlugin } from "webpack";
import { WebpackEnvConfig } from "./types";
export declare function DotenvWebpack<EnvObject = string>(config: WebpackEnvConfig<EnvObject>): DefinePlugin;
export declare class DotenvCmdWebpack<EnvObject = string> extends EnvironmentPlugin {
    [k: string]: string | ((...args: any[]) => void);
    constructor(config: WebpackEnvConfig<EnvObject>);
    apply(compiler: Compiler): void;
}
