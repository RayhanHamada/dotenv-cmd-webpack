export type WebpackEnvConfig<EnvObject> = {
  // the env file (should be in json format)
  filePath: string;

  // the desired environment
  env: EnvObject extends { [env: string]: any } ? keyof EnvObject : string;
};
