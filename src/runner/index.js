import fs from 'fs';
import path from 'path';
import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import Mocha from 'mocha';
import { getEnv, setEnv } from '../env-variables';
import co from 'co';

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

const ENV = getEnv();

const getWebpackConfig = () =>
    require('../../webpack.config').default;

const runWebpack = () => {
    webpack(getWebpackConfig(), (err, stats) => {
        if (!err) {
            console.log(stats.toString({colors: true}));
            console.log("");
            console.log("Completed compiling JS files.");
        }
    });
};

const runWebpackServer = () => {
    const webpackConfig = getWebpackConfig();
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, {
        inline: true,
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
    });
    server.listen(ENV.webpack_server_port, ENV.webpack_server_host);
    console.log("Webpack Dev Server started...");
};

const initDb = () => {
    const WeblogJS = require('../app').default;

    WeblogJS.init({
        sessionSecret: "asdfasd9DSAISD"
    });

    const admin = Object.freeze({
        email: "t@t.com",
        password: "tttttttt",
        display_name: "Admin",
        slug: 'admin'
    });

    co(function* () {
        console.log("Dropping the database...");
        yield WeblogJS.dbSettingOperator.dropDatabase();

        console.log("Creating indexes for collections...");
        yield WeblogJS.dbSettingOperator.createIndexes();

        console.log("Removing all the documents in the database...");
        yield WeblogJS.dbSettingOperator.removeAllDocuments();

        console.log("Creating the admin account...");
        yield WeblogJS.createUser(admin);

        console.log("Finished the initialization.");
        process.exit();
    }).catch((error) => {
        console.error(error);
    });

    process.on('uncaughtException', (error) => console.log(error.stack));
};

const runWeblogJsServer = () => {
    const WeblogJS = require('../app').default;

    WeblogJS.init({
        sessionSecret: "asdfasd9DSAISD"
    });

    co(function* () {
        yield WeblogJS.webServer.start();
        console.log("Web Server has started...");
    }).catch((error) => {
        console.error(error);
    });

    process.on('uncaughtException', (error) => console.log(error.stack));
};


const runTest = () => {
    const mocha = new Mocha({
        ui: 'bdd'
    });

    const testDir = '../../test';

    fs.readdirSync(testDir).filter((file) => {
        return file.substr(-8) === '.test.js';
    }).forEach((file) => {
        mocha.addFile(path.join(testDir, file));
    });

    mocha.run((failures) => {
        if (!failures) {
            process.exit();
        } else {
            process.exit(failures);
        }

        process.on('exit', () => {
            process.exit(failures);
        });
    });
};

switch (command) {
    case 'init':
        initDb();
        break;
    case 'development':
    case 'production':
        runWeblogJsServer();
        break;
    case 'webpack':
        runWebpack();
        break;
    case 'webpack-dev-server':
        runWebpackServer();
        break;
    case 'test':
        runTest();
        break;
    default:
        process.exit();
        break;
}
