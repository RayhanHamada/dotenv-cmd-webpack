/**
 * define WebpackEnvConfig
 */
export type WebpackEnvConfig<EnvObject = unknown> = {
  /**
   * represent the json object that you import in your webpack.config.ts,
   * if this specified, then filePath is not required to be specified and vice versa
   */
  envObject?: EnvObject;

  /**
   * represent the env file path,
   * if this specified, then envObject is not required to be specified and vice versa
   */
  filePath?: string;

  /**
   * represent the target environment, if your EnvObject type is specified,
   * whether it is specified in WebpackEnvConfig's type template param or you specify the
   * envObject, you should get intellisense suggestion of target environments available.
   */
  env: EnvObject extends { [env: string]: any } ? keyof EnvObject : string;

  /**
   * should this plugin print the environment variables, default to false
   */
  debug?: boolean;
};
