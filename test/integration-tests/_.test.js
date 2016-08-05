import {mongoDbBaseOperator} from 'simple-odm';
import {weblogjs} from './_setup';

const suppressLog = (func) => () =>
{
    const log = console.log;
    console.log = () => {};
    return func().then(() =>
    {
        console.log = log;
    });
};

describe('Integration Tests', () =>
{
    before('web server starting', suppressLog(weblogjs.start));
    before('dropping database', suppressLog(mongoDbBaseOperator.dropDatabase));
    beforeEach('emptying collections', suppressLog(mongoDbBaseOperator.removeAllDocuments));
    beforeEach('web server stopping', suppressLog(weblogjs.stop));
    beforeEach('web server starting', suppressLog(weblogjs.start));

    describe('Admin API', () =>
    {
        require('./admin-api-home')();
        require('./admin-api-login')();
        require('./admin-api-users')();
        require('./admin-api-categories')();
        require('./admin-api-posts')();
        require('./admin-api-setting')();
    });
})
