import React from 'react';
import PublicPagination from "../../react-components/public-pagination";
import config from "../../config";

const root = config.getValue('publicSiteRoot');

export default ({prevPageLink = null, nextPageLink = null}) =>
{
    const props = {};

    if (prevPageLink !== null)
    {
        props.prevPageLink = `${root}${prevPageLink}`;
    }

    if (nextPageLink !== null)
    {
        props.nextPageLink = `${root}${nextPageLink}`;
    }

    return Object.keys(props).length > 0 ? (
        <section className="module-section m-sct-short-section">
            <PublicPagination {...props} />
        </section>
    ) : null;
}