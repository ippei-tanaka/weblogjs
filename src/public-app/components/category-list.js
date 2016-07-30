import React from 'react';
import PublicCategoryList from "../../react-components/public-category-list";
import config from "../../config";
import urlResolver from "../../utilities/url-resolver";

const root = urlResolver.resolve(config.getValue('publicSiteRoot')) + "/";

export default ({categories}) => (
    <section className="module-section">
        <PublicCategoryList categories={categories} root={root} />
    </section>
);