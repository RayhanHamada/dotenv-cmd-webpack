"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
function debug(msg, debug) {
    if (debug) {
        console.log(`dotenv-cmd-webpack   : ${msg}`);
    }
}
exports.debug = debug;
