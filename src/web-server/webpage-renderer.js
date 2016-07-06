import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';

const renderHtmlLayout = (component) =>
{
    let html = ReactDOMServer.renderToStaticMarkup(component);
    return "<!DOCTYPE html>" + html;
};

export default class WebpageRenderer {

    constructor ({Layout})
    {
        this._Layout = Layout;
    }

    render ({renderProps, title, store})
    {
        const Layout = this._Layout;

        return renderHtmlLayout(
            <Layout title={title} preloadedState={store.getState()}>
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            </Layout>
        );
    }
}
