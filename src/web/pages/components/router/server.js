import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
import { appRoutes as routes } from './routes';
import Layout from '../layout/html'
import co from 'co';


var appMatch = (location) => new Promise((resolve, reject) => {

    match({routes, location}, (error, redirectLocation, renderProps) => {
        if (error) {
            reject(error);
        } else if (redirectLocation) {
            resolve({status: 302, data: redirectLocation.pathname});
        } else if (renderProps) {
            let element = <RoutingContext {...renderProps} />;
            let content = ReactDOMServer.renderToString(element);
            let html = ReactDOMServer.renderToStaticMarkup(<Layout />);
            html = html.replace("[CONTENT_PLACE_HOLDER]", content);
            resolve({status: 200, data: "<!DOCTYPE html>" + html});
        } else {
            resolve({status: 404, data: null});
        }
    });

});


export default ({location}) => new Promise((resolve, reject) => {
    co(function* () {
        resolve(yield appMatch(location));
    }).catch(reject);
});