import {match} from 'react-router';
import {OK, FOUND, NOT_FOUND, ERROR} from './../constants/status-codes';

export default ({routes, location}) => new Promise((resolve) =>
{
    match({routes, location}, (error, redirectLocation, renderProps) =>
    {
        if (renderProps)
        {
            resolve({statusCode: OK, renderProps})
        }
        else if (error)
        {
            resolve({statusCode: ERROR, error});
        }
        else if (redirectLocation)
        {
            resolve({statusCode: FOUND, redirectLocation});
        }
        else
        {
            resolve({statusCode: NOT_FOUND});
        }
    });
});