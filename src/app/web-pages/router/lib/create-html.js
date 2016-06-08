import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import reducers from '../../client-app/reducers';
import createStore from '../../client-app/stores/create-store';
import createActions from '../../client-app/stores/create-actions';
import co from 'co';
import { OK } from './status-codes';

export default (LayoutComponent, renderProps) => co(function* () {

    const { components, params } = renderProps;
    const store = createStore(reducers);
    const actions = createActions(store);

    let title = "Weblog JS";
    let data = {};
    let statusCode = OK;

    for (const component of components)
    {
        if (component && component.prepareForPreRendering)
        {
            data = yield component.prepareForPreRendering({store, actions, params, parentData: data});

            if (data && data.title) {
                title = data.title;
            }

            if (data && data.statusCode) {
                statusCode = data.statusCode;
            }
        }
    }

    let html = ReactDOMServer.renderToStaticMarkup(
        <LayoutComponent title={title} preloadedState={store.getState()}>
            <Provider store={store}>
                <RouterContext {...renderProps} />
            </Provider>
        </LayoutComponent>
    );

    html = "<!DOCTYPE html>" + html;

    return {html, statusCode};

}).catch(error => console.error(error.stack ? error.stack : error));
