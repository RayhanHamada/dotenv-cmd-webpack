/**
 * define WebpackEnvConfig
 */
export type WebpackEnvConfig = {
  /**
   * represent the env file path,
   * if this specified, then envObject is not required to be specified and vice versa
   */
  filePath: string;

  /**
   * the name of target environment
   */
  env: string;

  /**
   * should this plugin print the environment variables, default to false
   */
  debug?: boolean;

  /**
   * should resolve path ? default to true
   */
  shouldResolvePath?: boolean;
};
