import { getEnv, setEnv } from '../env-variables';

const options = {};
const argsArr = process.argv;
const command = argsArr[2];

// Parsing options
argsArr.slice(3).forEach(function (arg, index) {
    if (arg.indexOf("--") === 0) {
        const key = arg.split("--")[1];
        const value = argsArr[index + 1];
        options[key] = value;
    }
});

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
    case 'production':
        options.mode = "production";
        options.web_port = options.web_port || 3000;
        break;
    case 'webpack':
        options.mode = "production";
        options.web_port = options.web_port || 3000;
        break;
    case 'test':
        options.mode = "test";
        options.web_port = options.web_port || 3002;
        break;
    default:
        break;
}

setEnv(options);

switch (command) {
    case 'init':
        require('./db-init-runner').run();
        break;
    case 'development':
    case 'production':
        require('./server-runner').run();
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
    default:
        process.exit();
        break;
}
