export function debug(msg: string, debug?: boolean) {
  if (debug) {
    console.log(`dotenv-cmd-webpack   : ${msg}`);
  }
}
