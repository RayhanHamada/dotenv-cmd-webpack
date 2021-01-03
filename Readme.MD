# dotenv-cmd-webpack ![Node.js Package](https://github.com/RayhanHamada/dotenv-cmd-webpack/workflows/Node.js%20Package/badge.svg)

A webpack plugin for loading environment variable defined in a json object

This plugin's idea is based on [env-cmd](https://github.com/toddbluhm/env-cmd) and [dotenv-webpack](https://github.com/mrsteele/dotenv-webpack)

# Install

```
npm i -D dotenv-cmd-webpack // with npm

yarn add -D dotenv-cmd-webpack // or with yarn
```

# Usage

After install, you should make the .env file first, and this .env file should in json format.
Personally, i'd like to call my .env.json as .env-cmdrc.json, but u could call your .env whatever you want,
as long as it is in json format.

example:

```json
{
  "dev": {
    "BASE_SERVER_URL": "http://localhost:3000",
    "API_KEY": "keykeykey"
  },
  "prod": {
    "BASE_SERVER_URL": "https://your-url.example"
  }
}
```

As you can see, the "dev" and "prod" is the environment name, which is an object filled
with environment variables (this is how you specify .env in [env-cmd](https://github.com/toddbluhm/env-cmd) too)

After we create the .env file, then we have to import dotenv-cmd-webpack first in the webpack config file

```ts
const { dotenvCmdWebpack } = require('dotenv-cmd-webpack');
```

Or use this if you're using es6 or Typescript.
And yes, webpack config can be defined in Typescript file, see [this link](https://webpack.js.org/configuration/configuration-languages/#typescript)

```ts
import { dotenvCmdWebpack } from 'dotenv-cmd-webpack';
```

then call dotenvCmdWebpack inside configuration.plugins

```ts
// inside the configuration object
plugin: [
  dotenvCmdWebpack({
    filePath: 'path/to/your/.env.json',
    env: 'your env name',
  }),
];
```

And you're ready to go !

# License

MIT
