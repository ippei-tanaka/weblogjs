import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
import routes from '../routes';

export default ({location}) => new Promise((resolve, reject) => {

    match({routes, location}, (error, redirectLocation, renderProps) => {
        if (error) {
            reject(error);
        } else if (redirectLocation) {
            resolve({status: 302, redirectLocation});
        } else if (renderProps) {
            let body = ReactDOMServer.renderToString(<RoutingContext {...renderProps} />);
            resolve({status: 200, body});
        } else {
            resolve({status: 404});
        }
    });

});