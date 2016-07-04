import co from 'co';
import React from 'react';
import ReactDOMServer from '../../../node_modules/react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import reducers from '../../views/reducers';
import createStore from '../../views/stores/create-store';
import createActions from '../../views/stores/create-actions';
import { OK } from './status-codes';

export const createHtmlLayoutAndStatus = (LayoutComponent, renderProps) => co(function* ()
{

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

            if (data && data.title)
            {
                title = data.title;
            }

            if (data && data.statusCode)
            {
                statusCode = data.statusCode;
            }
        }
    }

    const html = renderHtmlLayout(
        <LayoutComponent title={title} preloadedState={store.getState()}>
            <Provider store={store}>
                <RouterContext {...renderProps} />
            </Provider>
        </LayoutComponent>
    );

    return {html, statusCode};

}).catch(error => console.error(error.stack ? error.stack : error));

export const renderHtmlLayout = (Component) =>
{
    let html = ReactDOMServer.renderToStaticMarkup(Component);
    return "<!DOCTYPE html>" + html;
};