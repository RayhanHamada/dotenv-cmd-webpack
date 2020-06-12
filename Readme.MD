# dotenv-cmd-webpack

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
const Dotenv = require("dotenv-cmd-webpack");
```

Or use this if you're using es6 or Typescript.
And yes, webpack config can be defined in Typescript file, see [this link](https://webpack.js.org/configuration/configuration-languages/#typescript)

```ts
import Dotenv from "dotenv-webpack-cmd";
```

then call Dotenv inside configuration.plugins

```ts
// inside the configuration object
plugin: [
  Dotenv({
    filePath: "path/to/your/.env.json",
    env: "your env name",
  }),
];
```

And you're ready to go !

But it's not the only way, dotenv-cmd-webpack also offers you with intellisense suggestion so you could know what environments is available.
here's how:

After import dotenv-cmd-webpack, import that .env json file to your webpack.config file.
NOTE that to do this you should set `resolveJsonModule` to be `true` inside your jsconfig.json or tsconfig.json `compilerOptions` !

```ts
const myEnv = require('./path/to/my/.env.json');

// or if your webpack.config using es6 or typescript syntax 
import myEnv from './path/to/my/.env.json';
```

and inside configuration.plugin, you could write:
```ts
plugin: [
  Dotenv({
    envObject: myEnv
    // just hit CTRL + Space here and list of environments suggestion should appears
    env: "your env name",
  }),
];

// or this (only for webpack.config written in typescript)
plugin: [
  Dotenv<typeof myEnv>({
    filePath: "path/to/your/.env.json",
    // just hit CTRL + Space here and voila !
    env: "your env name",
  }),
];
```
NOTE that the second option only works in typescript, since you cannot specify template parameter type in javascript (not without library like flow.js)
also NOTE if `envObject` is specified, then `filePath` is not required to be specified and vice versa. if you fill both, then dotenv-cmd-webpack will using
environments data from `envObject`.

# License
MIT