#!/usr/bin/env node

import "babel-polyfill";
import { getEnv, setEnv } from '../env-variables';

const options = {};
const argsArr = process.argv.slice(2);
let command = null;

// Parsing Options
for (let i = 0; i < argsArr.length; i++)
{
    const arg = argsArr[i];

    if (arg.indexOf("--") === 0)
    {
        const pairStr = arg.split("--")[1];

        if (!pairStr) continue;

        const pair = pairStr.split("=");
        const key = pair[0];
        const value = pair[1];

        if (!key || !value) continue;

        options[key] = value;
    } else {
        command = arg;
    }
}

switch (command) {
    case 'init':
        options.mode = "init";
        break;
    case 'development':
        options.mode = "development";
        options.web_port = options.web_port || 3001;
        options.webpack_server_host = options.webpack_server_host || "localhost";
        options.webpack_server_port = options.webpack_server_port || 8081;
        break;
    case 'webpack-dev-server':
        options.mode = "webpack-dev-server";
        options.web_port = options.web_port || 3001;
        options.webpack_server_host = options.webpack_server_host || "localhost";
        options.webpack_server_port = options.webpack_server_port || 8081;
        break;
    case 'webpack':
        options.mode = "webpack";
        break;
    case 'test':
        options.mode = "test";
        options.web_port = options.web_port || 3002;
        break;
    case 'production':
    default:
        options.mode = "production";
        options.web_port = options.web_port || 80;
        break;
}

setEnv(options);

switch (command) {
    case 'init':
        require('./db-init-runner').run();
        break;
    case 'webpack':
        require('./webpack-runner').run();
        break;
    case 'webpack-dev-server':
        require('./webpack-dev-server-runner').run();
        break;
    case 'test':
        require('./test-runner').run();
        break;
    case 'development':
    case 'production':
    default:
        require('./server-runner').run();
        break;
}
