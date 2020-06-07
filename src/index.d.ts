import { DefinePlugin } from "webpack";
import { WebpackEnvConfig } from "./types";
declare function WebpackEnv<EnvObject = string>(config: WebpackEnvConfig<EnvObject>): DefinePlugin;
export default WebpackEnv;
