import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
import routes from './routes';
import Layout from '../layout/html'

export default ({location}) => new Promise((resolve, reject) => {

    match({routes, location}, (error, redirectLocation, renderProps) => {
        if (error) {
            reject(error);
        } else if (redirectLocation) {
            resolve({status: 302, redirectLocation: redirectLocation.pathname});
        } else if (renderProps) {
            let content = ReactDOMServer.renderToString(<RoutingContext {...renderProps} />);
            let html = ReactDOMServer.renderToStaticMarkup(<Layout />);
            html = html.replace("[CONTENT_PLACE_HOLDER]", content);
            let body = "<!DOCTYPE html>" + html;
            resolve({status: 200, body});
        } else {
            resolve({status: 404});
        }
    });

});