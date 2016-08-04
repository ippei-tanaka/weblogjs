/* global describe it */

import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {ADMIN_URL} from './_setup';

export default function ()
{
    describe('/home', () =>
    {
        it('should return an empty object', (done) =>
        {
            co(function* ()
            {
                const obj = yield httpRequest.get(`${ADMIN_URL}/`);
                expect(Object.keys(obj).length).to.equal(0);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });
    });
};
