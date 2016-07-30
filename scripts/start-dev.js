import minimist from 'minimist';
import * as weblogjs from '../src/app';

const argv = minimist(process.argv.slice(2));
delete argv._;

weblogjs.init({
    webPort: 3000
});

weblogjs.start();
