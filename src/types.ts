/**
 * define WebpackEnvConfig
 */
export type WebpackEnvConfig = {
  /**
   * represent the env file path.
   */
  filePath: string;

  /**
   * represent the target environment.
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
