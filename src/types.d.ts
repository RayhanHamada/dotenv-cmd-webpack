export declare type WebpackEnvConfig<EnvObject> = {
    filePath: string;
    env: EnvObject extends {
        [env: string]: any;
    } ? keyof EnvObject : string;
};
