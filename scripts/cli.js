#!/usr/bin/env node

import WeblogJS from '../src/index';
import co from 'co';

const config = {};
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

        config[key] = value;
    }
    else
    {
        command = arg;
    }
}

WeblogJS.setConfig(config);

co(function* () {
    const result = WeblogJS[command]();

    if (result instanceof Promise)
    {
        yield result;
    }
}).catch(error => {
    console.error(error);
    process.exit(error);
});