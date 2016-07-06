import co from 'co';
import url from 'url';
import { match } from 'react-router';
import {OK, FOUND, NOT_FOUND, ERROR} from './../constants/status-codes';

const routing = ({routes, location}) => new Promise((resolve, reject) =>
{
    match({routes, location}, (error, redirectLocation, renderProps) =>
    {
        if (renderProps)
        {
            resolve({statusCode: OK, data: renderProps})
        }
        else if (error)
        {
            resolve({statusCode: ERROR, data: error});
        }
        else if (redirectLocation)
        {
            resolve({statusCode: FOUND, data: redirectLocation.pathname});
        }
        else
        {
            resolve({statusCode: NOT_FOUND, data: null});
        }
    });
});

const build = ({basePath, renderer, routes, hookRunner}) => (request, response) => co(function* ()
{
    const location = url.resolve(basePath, request.url);
    const { statusCode, data } = yield routing({routes, location});

    if (statusCode === OK)
    {
        const renderProps = data;
        const result = yield hookRunner.run({renderProps});
        const html = renderer.render({renderProps, title: result.title, store: result.store});
        response.status(OK).send(html);
        return;
    }

    return Promise.reject({statusCode, data});

}).catch((reason = {}) =>
{
    const {statusCode, data} = reason;

    if (statusCode === FOUND)
    {
        response.redirect(FOUND, data.pathname);
        return;
    }

    if (statusCode === ERROR)
    {
        response.status(ERROR).send(data.message);
        return;
    }

    if (statusCode === NOT_FOUND)
    {
        response.status(NOT_FOUND).send("Not Found!");
        return;
    }

    throw reason;

}).catch(e => console.error(e));

export default Object.freeze({build});