import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {ADMIN_URL} from './_setup';
import {admin} from './_data';

export default function ()
{
    describe('/login', () =>
    {
        it('should give a 401 error if the user try to retrieve restricted data when they haven\'t logged in', (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    yield httpRequest.get(`${ADMIN_URL}/users`);
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.response.statusCode).to.equal(401);
                done();
            }).catch(e =>
            {
                done(e);
            });
        });

        it('should let the user log in and log out', (done) =>
        {
            co(function* ()
            {
                yield httpRequest.post(`${ADMIN_URL}/login`, admin);
                yield httpRequest.get(`${ADMIN_URL}/users`);
                yield httpRequest.get(`${ADMIN_URL}/logout`);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });
    });
};
