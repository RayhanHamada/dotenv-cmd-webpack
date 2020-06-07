import { Compiler, Plugin } from "webpack";
import { WebpackEnvConfig } from "./types";
declare class WebpackEnv<EnvObject = string> extends Plugin {
    readonly config: WebpackEnvConfig<EnvObject>;
    constructor(config: WebpackEnvConfig<EnvObject>);
    apply(compiler: Compiler): void;
}
export default WebpackEnv;
