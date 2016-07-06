import co from 'co';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import AdminLayout from './layout';

const renderHtmlLayout = (component) =>
{
    let html = ReactDOMServer.renderToStaticMarkup(component);
    return "<!DOCTYPE html>" + html;
};

export default ({layoutAttributes}) => co(function* ()
{
    return renderHtmlLayout(<AdminLayout {...layoutAttributes} />);
});
