var minimist = require('minimist');
var weblogjs = require('../lib/app');

var argv = minimist(process.argv.slice(2));
delete argv._;

weblogjs.init(argv);

weblogjs.start();