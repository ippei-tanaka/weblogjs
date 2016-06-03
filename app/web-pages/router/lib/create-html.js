import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import reducers from '../../js/reducers';
import createStore from '../../js/stores/create-store';
import createActions from '../../js/stores/create-actions';
import co from 'co';

export default (renderProps, LayoutComponent) => co(function* () {

    const { components, params } = renderProps;
    const store = createStore(reducers);
    const actions = createActions(store);

    let title = "Weblog JS";
    let data = {};

    for (const component of components)
    {
        if (component && component.prepareForPreRendering)
        {
            data = yield component.prepareForPreRendering({store, actions, params, parentData: data});

            if (data && data.title) {
                title = data.title;
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

    return html;

}).catch(error => console.error(error.stack ? error.stack : error));
