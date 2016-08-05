import {expect} from 'chai';

const rootPath = process.env.NODE_ENV === "production" ? '../../lib' : '../../src';
const urlResolver = require(`${rootPath}/utilities/url-resolver`);

describe('urlResolver', () =>
{
    describe('resolve', () =>
    {
        it('should resolve a path', () =>
        {
            expect(urlResolver.resolve('testDir', 'test.js')).to.equal('testDir/test.js');
            expect(urlResolver.resolve('testDir1', 'testDir2', 'testDir3/test.js')).to.equal('testDir1/testDir2/testDir3/test.js');
        });

        it('should trim white space around a path', () =>
        {
            expect(urlResolver.resolve('  testDir1 ', ' testDir2', ' test.js  ')).to.equal('testDir1/testDir2/test.js');
            expect(urlResolver.resolve('  t estDir1 ', ' testDi r2', ' test.js  ')).to.equal('t estDir1/testDi r2/test.js');
        });

        it('should keep an absolute path absolute', () =>
        {
            expect(urlResolver.resolve('/testDir1 ', 'testDir2', 'test.js')).to.equal('/testDir1/testDir2/test.js');
        });
    });
});