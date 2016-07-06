import co from 'co';
import url from 'url';
import adminAppRender from '../admin-app/renderer';
import publicAppRender from '../public-app/renderer';
import {OK, FOUND, NOT_FOUND, ERROR} from './../constants/status-codes';

export const buildAdminHandler = ({basePath, production, webpackDevServerHost, webpackDevServerPort})
    => (request, response) => co(function* ()
{
    const html = yield adminAppRender({
        title: "WeblogJS Admin",
        production: false,
        webpackDevServerHost,
        webpackDevServerPort
    });
    response.status(OK).send(html);
});

export const buildPublicHandler = (basePath) => (request, response) => co(function* ()
{
    const location = url.resolve(basePath, request.url);
    const html = yield publicAppRender(location);
    response.status(OK).send(html);
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

});